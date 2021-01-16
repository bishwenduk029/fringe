const main = async () => {
  const some = await import("./src/pages/index.js");
  console.log(some);
};
main();
