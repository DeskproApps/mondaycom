export default function formatFormDate(formDate?: string) {
    if (!formDate || typeof formDate !== "string" || formDate.trim() === ""){
        return null
    }
    const date = new Date(formDate);

    if (isNaN(date.getTime())) {
        return null;
      }
  
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    // return the date as "DD MMM YYYY" so it can be used for the DateInput component
    return `${day} ${month} ${year}`;
  }