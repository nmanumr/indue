import { useEffect, useRef, useState, Component, createRef, RefObject } from "react";
import c from 'classnames';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

interface State {
  years: number[],
  selected: string[],
}

interface Props {
  allowRange: boolean;
  maxRangeLength: number;
  min: string;
  max: string;
  value: string;
  onChange: (selection: string[]) => void;
}

function yearsRange(YEARS_PAD: number, minYear: number, maxYear: number): number[] {
  let currentYear = new Date().getFullYear();
  let min = Math.max(currentYear - YEARS_PAD, minYear);
  let max = Math.min(currentYear + YEARS_PAD, maxYear);
  return Array(max - min + 1)
    .fill(0)
    .map((_, i) => i + min);
}

// TODO: smooth scroll on year change

export default class MonthSelector extends Component<Partial<Props>, State> {
  private yearElHeight: number = 0;
  private containerEl: RefObject<HTMLDivElement>;
  private preventScrollEvents = false;
  private sholdScrollToCurrentYear = false;

  private readonly YEARS_PAD = 5;
  private readonly defaultYearsRange;
  private readonly min?: [number, number] = undefined;
  private readonly max?: [number, number] = undefined;

  constructor(props: Partial<Props>) {
    super(props);

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    let [minYear, minMonth] = this.props.min?.split('-').map(i => +i) ?? [-Infinity, -Infinity];
    let [maxYear, maxMonth] = this.props.max?.split('-').map(i => +i) ?? [+Infinity, +Infinity];

    if (minYear !== -Infinity && minMonth !== -Infinity) this.min = [minYear, minMonth];
    if (maxYear !== Infinity && maxMonth !== Infinity) this.max = [maxYear, maxMonth];

    let years = yearsRange(this.YEARS_PAD, minYear, maxYear);
    this.defaultYearsRange = years;

    this.state = { years, selected: [`${currentYear}-${currentMonth}`] };
    this.containerEl = createRef();
  }

  componentDidMount() {
    this.yearElHeight = this.containerEl.current?.firstElementChild?.nextElementSibling?.clientHeight ?? 0;
    this.scrollToCurrentYear();

    let ticking = false;
    this.containerEl.current?.addEventListener('scroll', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (this.containerEl.current)
            this.handleScroll(this.containerEl.current.scrollTop);

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  componentDidUpdate() {
    if (this.sholdScrollToCurrentYear) {
      this.scrollToCurrentYear();
      this.preventScrollEvents = true;
      this.sholdScrollToCurrentYear = false;
    }
  }

  scrollToCurrentYear() {
    let currentYear = new Date().getFullYear();
    let minYear = this.defaultYearsRange[0];
    if (currentYear - minYear > 0) {
      this.containerEl.current?.scrollTo(0, this.yearElHeight * (currentYear - minYear));
    }
  }

  handleTodayBtn() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    if (this.state.years[0] !== this.defaultYearsRange[0]) {
      this.setState({
        years: this.defaultYearsRange,
        selected: [`${currentYear}-${currentMonth}`]
      });
    } else {
      this.setState({ selected: [`${currentYear}-${currentMonth}`] })
    }
    this.sholdScrollToCurrentYear = true;
  }

  handleMonthSelection([month, year]: [number, number]) {
    this.setState({ selected: [`${year}-${month}`] });
    if (this.props.onChange)
      this.props.onChange([`${year}-${month}`]);
  }

  handleScroll(scrollTop: number) {
    if (this.preventScrollEvents) {
      this.preventScrollEvents = false;
      return;
    }
    let center = this.state.years.length / 2;
    if (scrollTop < this.yearElHeight * (center - 1)) {
      if (!this.props.min || this.state.years[0] - 1 >= +this.props.min.split('-')[0]) {
        let years = [this.state.years[0] - 1, ...this.state.years.slice(0, -1)]
        this.setState({ years });
      }
    } else if (scrollTop > this.yearElHeight * (center + 1)) {
      if (!this.props.max || this.state.years[0] - 1 <= +this.props.max.split('-')[0]) {
        let years = [...this.state.years.slice(1), this.state.years[this.state.years.length - 1] + 1];
        this.setState({ years });
      }
    }
  }

  handleNextMonth() {
    let nextScrollHeight = (Math.floor((this.containerEl.current?.scrollTop ?? 0) / this.yearElHeight) + 1) * this.yearElHeight;
    this.containerEl.current?.scrollTo(0, nextScrollHeight + 46);
  }

  handlePrevMonth() {
    let nextScrollHeight = (Math.floor((this.containerEl.current?.scrollTop ?? 0) / this.yearElHeight) - 1) * this.yearElHeight;
    this.containerEl.current?.scrollTo(0, nextScrollHeight + 46);
  }

  render() {
    return (
      <div ref={this.containerEl} className="relative w-72 h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg">
        <div className="sticky top-0 flex items-center py-1.5 px-1.5 z-10 bg-gray-50 border-b border-gray-200">
          <button onClick={this.handlePrevMonth.bind(this)} className="text-gray-600 pt-2 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-11"></div>
          <button onClick={this.handleNextMonth.bind(this)} className="text-gray-600 ml-0.5 pt-2 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex-grow"></div>
          <button onClick={this.handleTodayBtn.bind(this)} className="text-gray-600 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        {this.state.years.map((year, yearIndex) => {
          return <div className={c("relative", { '-mt-11': yearIndex === 0 })} key={year} data-year={year}>
            <span className="z-20 sticky top-2 inline-block ml-11 pt-1.5 pb-1.5 text-sm font-medium text-gray-500">
              {year}
            </span>
            <div className="border-b border-gray-200 p-6 grid grid-cols-4 gap-2 mb-px">
              {months.map((month, index) => {
                // console.log(this.min, year, index);
                if (this.min && year <= this.min[0] && index <= this.min[1]) {
                  return <span key={`${year}-${month}`} className="p-2 flex items-center justify-center uppercase text-sm text-gray-400">
                    {month}
                  </span>;
                }

                return <button
                  key={`${year}-${month}`}
                  onClick={() => this.handleMonthSelection([index, year])}
                  className={c(
                    "p-2 flex items-center justify-center rounded cursor-pointer uppercase text-sm",
                    this.state.selected[0] == `${year}-${index}`
                      ? 'text-blue-600 bg-blue-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >{month}</button>
              })}
            </div>
          </div>
        })}
      </div>
    );
  }
}
