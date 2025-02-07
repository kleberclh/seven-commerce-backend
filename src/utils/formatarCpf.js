export function formatarCpf(value) {
  value = value.replace(/\D/g, ""); // Remove tudo que não for número

  if (value.length > 11) {
    value = value.slice(0, 11); // Garante que tenha no máximo 11 dígitos
  }

  return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
