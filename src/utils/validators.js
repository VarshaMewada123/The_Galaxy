export const isValidEmail = (email) => {
  const regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);
