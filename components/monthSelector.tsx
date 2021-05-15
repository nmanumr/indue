import { useEffect, useRef, useState, Component, createRef, RefObject } from "react";
import c from 'classnames';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

interface State {
  years: number[],
  selected: [number, number][],
}

export default class MonthSelector extends Component<{}, State> {
  private yearElHeight: number = 0;
  private containerEl: RefObject<HTMLDivElement>;
  private preventScrollEvents = false;
  private sholdScrollToCurrentYear = false;
  private readonly YEARS_PAD = 5;

  constructor(props: {}) {
    super(props);

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    this.state = {
      years: Array.from(Array(this.YEARS_PAD * 2 + 1).keys()).map(i => currentYear - this.YEARS_PAD + i),
      selected: [[currentMonth, currentYear]],
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
        selected: [[currentMonth, currentYear]]
      });
    } else {
      // this.scrollToCurrentYear();
      this.setState({selected: [[currentMonth, currentYear]]})
    }
    this.sholdScrollToCurrentYear = true;
  }

  handleMonthSelection([month, year]: [number, number]) {
    this.setState({selected: [[month, year]]})
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

  render() {
    return (
      <div ref={this.containerEl} className="w-72 h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg">
        <div className="flex py-1.5 px-4 sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
          <div className="flex-grow"></div>
          <button onClick={this.handleTodayBtn.bind(this)} className="text-gray-600 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        {this.state.years.map((year) => {
          return <div className="relative" key={year} data-year={year}>
            <span className="z-20 sticky top-2 px-6 py-1.5 text-sm font-medium text-gray-500">
              {year}
            </span>
            <div className="px-6 grid grid-cols-4 gap-2 py-4 mt-4">
              {months.map((month, index) => {
                return <button
                  key={`${year}-${month}`}
                  onClick={() => this.handleMonthSelection([index, year])}
                  className={c(
                    "p-2 flex items-center justify-center rounded cursor-pointer uppercase text-sm",
                    this.state.selected.find(([i, y]) => i === index && y === year)
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
