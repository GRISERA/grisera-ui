export default (dayOfMonth: number): string => {
    const day = new Date();
    day.setDate(dayOfMonth)
    return day.toISOString().split("T")[0]
};
