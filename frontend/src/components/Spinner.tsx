interface SpinnerProps {
  fullPage?: boolean
}

export default function Spinner({ fullPage = false }: SpinnerProps) {
  if (fullPage) {
    return (
      <div className="spinner-page">
        <span className="spinner" aria-label="Loading" />
      </div>
    )
  }
  return <span className="spinner" aria-label="Loading" />
}
