const formatDateTime = (datetime, format) =>  {
    let checkDate = new Date(datetime.replace(/-/g, "/"));
    let dateTime = Number.isNaN(checkDate.getDate()) ? new Date(datetime) : new Date(datetime.replace(/-/g, "/"));
    const toTwoDigits = (num) => (num < 10 ? `0${num}` : num);
    let year = +dateTime.getFullYear() + 543;
    let month = dateTime.getMonth();
    let day = dateTime.getDate();
    let dayWeek = +dateTime.getDay();
    let hour = toTwoDigits(dateTime.getHours());
    let minute = toTwoDigits(dateTime.getMinutes());
    let currentDate = "";
    let dayOfWeek = [
        "อาทิตย์",
        "จันทร์",
        "อังคาร",
        "พุธ",
        "พฤหัสบดี",
        "ศุกร์",
        "เสาร์",
    ];
    let arrMonthTH = [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
    ];
    let arrMonthFullTH = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ];

    if (format === 1) {
        currentDate = `${toTwoDigits(day)}/${toTwoDigits(+month + 1)}/${year}`;
    } else if (format === 2) {
        currentDate = `${dayOfWeek[dayWeek]}, ${day} ${arrMonthFullTH[month]} ${year} ${hour}:${minute} น.`;
    } else if (format === 3) {
        currentDate = `${day} ${arrMonthFullTH[month]} ${year}, ${hour}:${minute} น.`;
    } else if (format === 4) {
        currentDate = `${dayOfWeek[dayWeek]}, ${day} ${arrMonthFullTH[month]} ${year}`;
    } else if (format === 6) {
        currentDate = `${dayOfWeek[dayWeek]}, ${day} ${arrMonthTH[month]} ${year}`;
    } else if (format === 5) {
        currentDate = `${day} ${arrMonthTH[month]} ${year} ${hour}:${minute} น.`;
    } else {
        currentDate = `${day} ${arrMonthFullTH[month]} ${year}`;
    }
    return currentDate;
}

export default formatDateTime