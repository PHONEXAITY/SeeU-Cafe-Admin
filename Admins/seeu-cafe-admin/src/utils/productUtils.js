export const initialFormState = {
  type: "food",
  name: "",
  price: "",
  category_id: "",
  status: "active",
  description: "",
  image: null,
  hot_price: "",
  ice_price: "",
};

export const sortProducts = (products, sortField, sortDirection) => {
  return [...products].sort((a, b) => {
    let compareA = a[sortField];
    let compareB = b[sortField];

    if (typeof compareA === "string") compareA = compareA.toLowerCase();
    if (typeof compareB === "string") compareB = compareB.toLowerCase();

    if (compareA == null && compareB == null) return 0;
    if (compareA == null) return 1;
    if (compareB == null) return -1;

    return sortDirection === "asc"
      ? compareA < compareB
        ? -1
        : 1
      : compareA > compareB
      ? -1
      : 1;
  });
};
