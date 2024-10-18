const tailwindColors = [
  'bg-red-700',
  'bg-blue-700',
  'bg-green-700',
  'bg-yellow-700',
  'bg-purple-700',
  'bg-pink-700',
  'bg-indigo-700',
  'bg-teal-700',
  'bg-orange-700',
  'bg-gray-700',
]

export function getRoleColor(roleId: string): string {
  const index =
    roleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    tailwindColors.length

  return tailwindColors[index]
}
