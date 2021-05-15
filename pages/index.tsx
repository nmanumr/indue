import MonthSelector from "../components/monthSelector";


export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <MonthSelector min="2020-02"></MonthSelector>
    </div>
  )
}
