const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const dayFromDate = (dateString) => {
    var d = new Date(dateString);
    return days[d.getDay()];
}


export const getSortedDays = () => {
    var day_of_week = new Date().getDay();
    return days.slice(day_of_week).concat(days.slice(0,day_of_week));
    //console.log(test);
}
