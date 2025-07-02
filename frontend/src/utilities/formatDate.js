
export default function formatDate(date) {
return new Date(date).toLocaleDateString("en-IN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
}
