export function formatarTelefone(value) {
  value = value.replace(/\D/g, ""); // Remove tudo que não for número

  if (value.length > 10) {
    return value.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else {
    return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  }
}
