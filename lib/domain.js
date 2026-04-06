import { readDb, writeDb } from "@/lib/db";

const requestTypeLabels = {
  late_open: "فتح متأخر",
  room_change: "تغيير قاعة",
  extension: "تمديد الجلسة",
};

const approvalStatuses = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
};

function getNow() {
  return new Date();
}

function buildDateTime(date, timeText) {
  const [hours, minutes] = timeText.split(":").map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate;
}

function formatHashSeed() {
  return Math.random().toString(16).slice(2, 14);
}

function getFacultyRecord(db, facultyId) {
  const faculty = db.faculty.find((item) => item.id === facultyId);
  if (!faculty) {
    throw new Error("عضو هيئة التدريس غير موجود");
  }
  return faculty;
}

function getRoomRecord(db, roomId) {
  const room = db.rooms.find((item) => item.id === roomId);
  if (!room) {
    throw new Error("القاعة غير موجودة");
  }
  return room;
}

function getRequestTypeLabel(type) {
  return requestTypeLabels[type] || type;
}

function getRequestsForToday(db, facultyId, now) {
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  return db.requests.filter((request) => {
    const requestDate = new Date(request.createdAt);
    return request.facultyId === facultyId && requestDate >= startOfDay;
  });
}

function deriveSession(db, faculty, now = getNow()) {
  const schedule = faculty.schedule;
  const startAt = buildDateTime(now, schedule.startTime);
  const baseEndAt = buildDateTime(now, schedule.endTime);
  const todayRequests = getRequestsForToday(db, faculty.id, now);
  const approvedExtensions = todayRequests.filter(
    (request) => request.type === "extension" && request.status === "approved"
  );
  const extensionMinutes = approvedExtensions.reduce(
    (total, request) => total + Number(request.requestedMinutes || 0),
    0
  );
  const endAt = new Date(baseEndAt.getTime() + extensionMinutes * 60 * 1000);
  const approvedRoomChange = [...todayRequests]
    .reverse()
    .find((request) => request.type === "room_change" && request.status === "approved");
  const approvedLateOpen = [...todayRequests]
    .reverse()
    .find((request) => request.type === "late_open" && request.status === "approved");
  const activeRoom = getRoomRecord(
    db,
    approvedRoomChange?.requestedRoomId || faculty.defaultRoomId
  );
  const autoOpenEndsAt = new Date(startAt.getTime() + 10 * 60 * 1000);
  const isActive = now >= startAt && now <= endAt;
  const reminderActive = isActive && endAt.getTime() - now.getTime() <= 5 * 60 * 1000;
  const powerOpen =
    activeRoom.state === "سليمة" &&
    ((now >= startAt && now <= autoOpenEndsAt) || Boolean(approvedLateOpen));
  let phaseLabel = "قادمة";
  let statusMessage = "بانتظار بداية المحاضرة";

  if (isActive) {
    phaseLabel = "جارية";
    statusMessage =
      now <= autoOpenEndsAt
        ? "الكهرباء مفعلة تلقائيًا خلال أول 10 دقائق من بداية المحاضرة."
        : powerOpen
          ? "تم فتح الطاقة عبر طلب معتمد."
          : "انتهت نافذة التشغيل التلقائي. يمكنك رفع طلب فتح متأخر من النموذج الموحد أدناه.";
  } else if (now > endAt) {
    phaseLabel = "منتهية";
    statusMessage = "انتهت الجلسة، ويمكن مراجعة السجل التشغيلي أو رفع طلب مرتبط بالمحاضرة القادمة.";
  }

  return {
    courseCode: schedule.courseCode,
    courseName: schedule.courseName,
    section: schedule.section,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    autoOpenEndsAt: autoOpenEndsAt.toISOString(),
    phaseLabel,
    remainingMinutes: Math.max(0, Math.ceil((endAt.getTime() - now.getTime()) / 60000)),
    reminderActive,
    statusMessage,
    powerOpen,
    room: activeRoom,
  };
}

function withFacultyNames(db, records) {
  return records.map((record) => {
    const faculty = getFacultyRecord(db, record.facultyId);
    const roomId = record.requestedRoomId || faculty.defaultRoomId;
    const room = getRoomRecord(db, roomId);
    return {
      ...record,
      facultyName: faculty.name,
      roomName: room.name,
      typeLabel: getRequestTypeLabel(record.type),
      statusLabel: approvalStatuses[record.status] || record.status,
    };
  });
}

function withLogFacultyNames(db, logs) {
  return logs.map((log) => ({
    ...log,
    facultyName: getFacultyRecord(db, log.facultyId).name,
  }));
}

export function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat("ar-SA", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export async function getAdminOverview() {
  const db = await readDb();
  const now = getNow();
  const rooms = db.rooms.map((room) => {
    const matchingFaculty = db.faculty.find((faculty) => {
      const session = deriveSession(db, faculty, now);
      return session.room.id === room.id && session.phaseLabel === "جارية";
    });
    const matchingSession = matchingFaculty ? deriveSession(db, matchingFaculty, now) : null;

    return {
      ...room,
      powerOn: matchingSession?.powerOpen || false,
      activeCourse: matchingSession?.courseName || null,
      activeFaculty: matchingFaculty?.name || null,
    };
  });

  const facultySummary = db.faculty.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    department: faculty.department,
    exceptionCount: db.requests.filter((request) => request.facultyId === faculty.id).length,
  }));

  const stateCounts = rooms.reduce((accumulator, room) => {
    accumulator[room.state] = (accumulator[room.state] || 0) + 1;
    return accumulator;
  }, {});

  const requestCounts = db.requests.reduce((accumulator, request) => {
    accumulator[request.type] = (accumulator[request.type] || 0) + 1;
    return accumulator;
  }, {});

  const todaysSessions = db.faculty.filter((faculty) => faculty.schedule.weekday === now.getDay()).length;
  const approvedRequests = db.requests.filter((request) => request.status === "approved").length;

  return {
    generatedAt: now.toISOString(),
    blockchain: db.blockchain,
    integrations: db.integrations,
    kpis: {
      totalRooms: rooms.length,
      todaysSessions,
      totalRequests: db.requests.length,
      pendingRequests: db.requests.filter((request) => request.status === "pending").length,
      totalFaculty: db.faculty.length,
      totalExceptionsByFaculty: facultySummary.reduce(
        (total, faculty) => total + faculty.exceptionCount,
        0
      ),
      approvalRate: Math.round((approvedRequests / Math.max(1, db.requests.length)) * 100),
    },
    charts: {
      energyTrend: [
        { label: "08:00", load: 4.1 },
        { label: "09:00", load: 5.8 },
        { label: "10:00", load: 7.2 },
        { label: "11:00", load: 6.4 },
        { label: "12:00", load: 5.1 },
        { label: "13:00", load: 4.4 },
      ],
      roomStateDistribution: Object.entries(stateCounts).map(([name, value]) => ({ name, value })),
      requestTypes: Object.entries(requestCounts).map(([type, count]) => ({
        label: getRequestTypeLabel(type),
        count,
      })),
    },
    rooms,
    requests: withFacultyNames(
      db,
      [...db.requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ),
    facultySummary,
    logs: withLogFacultyNames(
      db,
      [...db.logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6)
    ),
  };
}

export async function getFacultyPortalData(facultyId) {
  const db = await readDb();
  const faculty = getFacultyRecord(db, facultyId);
  const session = deriveSession(db, faculty);
  const logs = withLogFacultyNames(
    db,
    db.logs
      .filter((log) => log.facultyId === facultyId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 4)
  );
  const latestRequest = db.requests
    .filter((request) => request.facultyId === facultyId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  return {
    faculty,
    session,
    availableRooms: db.rooms.filter((room) => room.state === "سليمة" || room.id === session.room.id),
    latestRequestLabel: latestRequest
      ? `${getRequestTypeLabel(latestRequest.type)} - ${approvalStatuses[latestRequest.status]}`
      : "لا توجد طلبات بعد",
    logs,
  };
}

function buildLogEntry(request, details, action, timestamp) {
  return {
    id: `log-${Date.now()}`,
    facultyId: request.facultyId,
    action,
    details,
    timestamp,
    txHash: `0xedu${formatHashSeed()}`,
  };
}

export async function createFacultyRequest(payload) {
  if (!payload.facultyId || !payload.type) {
    throw new Error("البيانات المطلوبة غير مكتملة");
  }

  return writeDb((db) => {
    const faculty = getFacultyRecord(db, payload.facultyId);
    const now = getNow();
    const session = deriveSession(db, faculty, now);

    if (payload.type === "late_open" && now <= new Date(session.autoOpenEndsAt)) {
      throw new Error("التشغيل التلقائي ما زال فعالًا، لا حاجة لطلب فتح متأخر الآن");
    }

    if (payload.type === "late_open" && !payload.reason?.trim()) {
      throw new Error("سبب الفتح المتأخر مطلوب");
    }

    if (payload.type === "room_change" && !payload.requestedRoomId) {
      throw new Error("يجب اختيار القاعة البديلة");
    }

    if (payload.type === "extension" && !payload.requestedMinutes) {
      throw new Error("يجب تحديد مدة التمديد");
    }

    const timestamp = now.toISOString();
    const nextRequest = {
      id: `req-${Date.now()}`,
      facultyId: payload.facultyId,
      type: payload.type,
      reason: payload.reason?.trim() || "بدون ملاحظات إضافية",
      status: "approved",
      requestedRoomId: payload.requestedRoomId || null,
      requestedMinutes: payload.requestedMinutes || null,
      createdAt: timestamp,
      reviewedAt: timestamp,
      reviewNote: "اعتماد مباشر من التجربة الجديدة.",
    };

    db.requests.unshift(nextRequest);

    const roomName = nextRequest.requestedRoomId
      ? getRoomRecord(db, nextRequest.requestedRoomId).name
      : session.room.name;

    let action = getRequestTypeLabel(nextRequest.type);
    let details = `${faculty.name} رفع طلب ${action} في ${roomName}.`;
    let message = "تم اعتماد الطلب مباشرة وتحديث الحالة بنجاح.";

    if (nextRequest.type === "late_open") {
      details = `${faculty.name} حصل على فتح متأخر في ${session.room.name} بسبب: ${nextRequest.reason}`;
      message = "تم اعتماد طلب الفتح المتأخر مباشرة.";
    }

    if (nextRequest.type === "room_change") {
      details = `${faculty.name} تم تحويل محاضرته فورًا إلى ${roomName} بسبب: ${nextRequest.reason}`;
      message = `تم اعتماد تغيير القاعة مباشرة إلى ${roomName}.`;
    }

    if (nextRequest.type === "extension") {
      details = `${faculty.name} حصل على تمديد مباشر لمدة ${nextRequest.requestedMinutes} دقيقة. السبب: ${nextRequest.reason}`;
      message = `تم اعتماد تمديد الجلسة ${nextRequest.requestedMinutes} دقيقة مباشرة.`;
    }

    db.logs.unshift(buildLogEntry(nextRequest, details, action, timestamp));

    return {
      db,
      result: {
        ok: true,
        request: nextRequest,
        message,
      },
    };
  });
}

export async function reviewRequest(requestId, decision, reviewNote) {
  if (!["approve", "reject"].includes(decision)) {
    throw new Error("قرار المراجعة غير صالح");
  }

  return writeDb((db) => {
    const request = db.requests.find((item) => item.id === requestId);
    if (!request) {
      throw new Error("الطلب غير موجود");
    }

    const faculty = getFacultyRecord(db, request.facultyId);
    request.status = decision === "approve" ? "approved" : "rejected";
    request.reviewedAt = getNow().toISOString();
    request.reviewNote = reviewNote || null;

    const room = getRoomRecord(db, request.requestedRoomId || faculty.defaultRoomId);
    const action =
      decision === "approve"
        ? `اعتماد ${getRequestTypeLabel(request.type)}`
        : `رفض ${getRequestTypeLabel(request.type)}`;
    const details =
      decision === "approve"
        ? `تم اعتماد طلب ${getRequestTypeLabel(request.type)} للعضو ${faculty.name} في ${room.name}.`
        : `تم رفض طلب ${getRequestTypeLabel(request.type)} للعضو ${faculty.name} في ${room.name}.`;

    db.logs.unshift(buildLogEntry(request, details, action, request.reviewedAt));

    return {
      db,
      result: {
        ok: true,
        request,
        message: decision === "approve" ? "تم اعتماد الطلب" : "تم رفض الطلب",
      },
    };
  });
}
