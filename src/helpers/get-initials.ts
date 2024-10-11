export function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(' ')

  const firstNameInitial = nameParts[0][0].toUpperCase()
  const lastNameInitial =
    nameParts.length > 1 ? nameParts[nameParts.length - 1][0].toUpperCase() : ''

  return firstNameInitial + lastNameInitial
}
