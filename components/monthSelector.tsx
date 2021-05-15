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
  onChange: (selection: string[]) => void;
}

export default class MonthSelector extends Component<Partial<Props>, State> {
  private yearElHeight: number = 0;
  private containerEl: RefObject<HTMLDivElement>;
  private preventScrollEvents = false;
  private sholdScrollToCurrentYear = false;
  private readonly YEARS_PAD = 5;

  constructor(props: Partial<Props>) {
    super(props);

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    this.state = {
      years: Array.from(Array(this.YEARS_PAD * 2 + 1).keys()).map(i => currentYear - this.YEARS_PAD + i),
      selected: [`${currentYear}-${currentMonth}`],
    };
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
    this.containerEl.current?.scrollTo(0, this.yearElHeight * this.YEARS_PAD + 46);
  }

  handleTodayBtn() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    if (this.state.years[0] !== currentYear - this.YEARS_PAD) {
      this.setState({
        years: Array.from(Array(this.YEARS_PAD * 2 + 1).keys()).map(i => currentYear - this.YEARS_PAD + i),
        selected: [`${currentYear}-${currentMonth}`]
      });
    } else {
      this.setState({selected: [`${currentYear}-${currentMonth}`]})
    }
    this.sholdScrollToCurrentYear = true;
  }

  handleMonthSelection([month, year]: [number, number]) {
    this.setState({selected: [`${year}-${month}`]});
    if (this.props.onChange)
      this.props.onChange([`${year}-${month}`]);
  }

  handleScroll(scrollTop: number) {
    if (this.preventScrollEvents) {
      this.preventScrollEvents = false;
      return;
    }
    if (scrollTop < this.yearElHeight * (this.YEARS_PAD - 1)) {
      let years = [this.state.years[0] - 1, ...this.state.years.slice(0, -1)]
      this.setState({years});
    } else if (scrollTop > this.yearElHeight * (this.YEARS_PAD + 2)) {
      let years = [...this.state.years.slice(1), this.state.years[this.state.years.length - 1] + 1];
      this.setState({years});
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
      <div ref={this.containerEl} className="w-72 h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg">
        <div className="flex items-center py-1.5 px-1.5 sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
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
        {this.state.years.map((year) => {
          return <div className="relative" key={year} data-year={year}>
            <span className="z-20 sticky top-2 inline-block ml-11 pt-1.5 pb-1.5 text-sm font-medium text-gray-500">
              {year}
            </span>
            <div className="border-b border-gray-200 p-6 grid grid-cols-4 gap-2 mb-px">
              {months.map((month, index) => {
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
