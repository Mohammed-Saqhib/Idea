export const Progress = ({ value, max = 100, className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 ${className}`}>
      <div
        className="h-full gradient-primary rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

