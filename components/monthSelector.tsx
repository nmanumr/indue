import { Component, createRef, RefObject } from "react";
import c from 'classnames';

/*---------------------
 * Component Types
 *---------------------*/

interface State {
  years: number[],
  selected: string[],
}

interface Props {
  min: string;
  max: string;
  value: string;
  onChange: (selection: string[]) => void;
}

/*---------------------
 * Utils
 *---------------------*/

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/**
 * returns a array of year between min and max
 * if min or max is not defined `YEARS_PAD` years from current year will beused 
 */
function yearsRange(YEARS_PAD: number, minYear: number, maxYear: number): number[] {
  let currentYear = new Date().getFullYear();
  let min = Math.max(currentYear - YEARS_PAD, minYear);
  let max = Math.min(currentYear + YEARS_PAD, maxYear);
  return Array(max - min + 1)
    .fill(0)
    .map((_, i) => i + min);
}

/*---------------------
 * Main Component
 *---------------------*/

export default class MonthSelector extends Component<Partial<Props>, State> {
  /** height of div for a single year */
  private yearElHeight: number = 0;
  /** main container element */
  private containerEl: RefObject<HTMLDivElement>;
  /** if true scroll event will be ignored */
  private preventScrollEvents = false;
  /** if true current year be scrolled to view after component is rerendered */
  private sholdScrollToCurrentYear = false;
  /** timeout reference to clear scroll event prevention */
  private animationTimerId?: ReturnType<typeof setTimeout>;

  private readonly YEARS_PAD = 5;
  /** years rnge that was calculated first time */
  private readonly defaultYearsRange;
  /** parsed min max values from props */
  private readonly min?: [number, number] = undefined;
  private readonly max?: [number, number] = undefined;

  constructor(props: Partial<Props>) {
    super(props);

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    
    // may be we need to do this somewhere else
    let [minYear, minMonth] = this.props.min?.split('-').map(i => +i) ?? [-Infinity, -Infinity];
    let [maxYear, maxMonth] = this.props.max?.split('-').map(i => +i) ?? [+Infinity, +Infinity];

    if (minYear !== -Infinity && minMonth !== -Infinity) this.min = [minYear, minMonth];
    if (maxYear !== +Infinity && maxMonth !== +Infinity) this.max = [maxYear, maxMonth];

    let years = yearsRange(this.YEARS_PAD, minYear, maxYear);
    this.defaultYearsRange = years;

    this.state = { years, selected: [`${currentYear}-${currentMonth}`] };
    this.containerEl = createRef();
  }

  componentDidMount() {
    this.yearElHeight = this.containerEl.current?.firstElementChild?.nextElementSibling?.clientHeight ?? 0;
    this.scrollToCurrentYear(false); // false to disable smooth scroll

    // throlle scroll events to only animation frames
    let ticking = false;
    this.containerEl.current?.addEventListener('scroll', (e) => {
      if (!ticking && !this.preventScrollEvents) {
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
      this.sholdScrollToCurrentYear = false;

      this.clearScrollPrevent();
    }
  }

  /** Scroll to move current year in view */
  scrollToCurrentYear(smooth = true) {
    let currentYear = new Date().getFullYear();
    let minYear = this.defaultYearsRange[0];

    if (currentYear - minYear > 0) {
      if (smooth) this.preventScrollEvents = true;

      this.containerEl.current?.scrollTo({
        left: 0,
        top: this.yearElHeight * (currentYear - minYear),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }

  /**
   * marks preventScrollEvents as false after some time
   */
  clearScrollPrevent() {
    // if there is already a unresolved timer 
    // clear it and emit and scroll event
    if (this.animationTimerId) {
      clearTimeout(this.animationTimerId);

      // emitting a scroll event inbetween helps load more years
      // in view before user has scrolled to end
      if (this.containerEl.current)
        this.handleScroll(this.containerEl.current.scrollTop);
    }

    // on chrome 90 smooth scroll take arround 250ms
    // not sure about other browsers
    this.animationTimerId = setTimeout(() => {
      this.preventScrollEvents = false;
      if (this.containerEl.current)
        this.handleScroll(this.containerEl.current.scrollTop);
    }, 250);
  }

  /** handler for today button */
  handleTodayBtn() {
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    // reset view to current year in center
    if (this.state.years[0] !== this.defaultYearsRange[0]) {
      this.setState({
        years: this.defaultYearsRange,
        selected: [`${currentYear}-${currentMonth}`]
      });
    } else {
      this.setState({ selected: [`${currentYear}-${currentMonth}`] })
    }
    // actuall scrolling will happen on next rerender
    // just to avoid a jerk when  years array has been changed
    this.sholdScrollToCurrentYear = true;
  }

  /** When a month is clicked */
  handleMonthSelection([month, year]: [number, number]) {
    this.setState({ selected: [`${year}-${month}`] });
    if (this.props.onChange)
      this.props.onChange([`${year}-${month}`]);
  }

  /** change content when view has been scrolled */
  handleScroll(scrollTop: number) {
    let center = this.state.years.length / 2;

    if (scrollTop < this.yearElHeight * (center - 2)) {
      // when user has scrolled 2 years before center year
      // load a previous year and remove last year from view
      if (!this.min || this.state.years[0] - 1 >= this.min[0]) {
        let years = [this.state.years[0] - 1, ...this.state.years.slice(0, -1)]
        this.setState({ years });
      }
    } else if (scrollTop > this.yearElHeight * (center + 2)) {
      // when user has scrolled 2 years after center year
      // load a next year and remove first year from view
      if (!this.max || this.state.years[this.state.years.length - 1] + 1 <= this.max[0]) {
        let years = [...this.state.years.slice(1), this.state.years[this.state.years.length - 1] + 1];
        this.setState({ years });
      }
    }
  }

  /** when next month button will be clicked */
  handleNextMonth() {
    let nextScrollHeight = (Math.floor((this.containerEl.current?.scrollTop ?? 0) / this.yearElHeight) + 1) * this.yearElHeight;
    this.preventScrollEvents = true;
    this.containerEl.current?.scrollTo({
      left: 0,
      top: nextScrollHeight + 1,
      behavior: 'smooth',
    });

    this.clearScrollPrevent();
  }

  /** when previous month button will be clicked */
  handlePrevMonth() {
    let nextScrollHeight = (Math.floor((this.containerEl.current?.scrollTop ?? 0) / this.yearElHeight) - 1) * this.yearElHeight;
    this.preventScrollEvents = true;
    this.containerEl.current?.scrollTo({
      left: 0,
      top: nextScrollHeight + 1,
      behavior: 'smooth',
    });

    this.clearScrollPrevent();
  }

  render() {
    return (
      <div ref={this.containerEl} className="relative w-72 h-52 overflow-y-auto bg-white border border-gray-300 rounded-lg keep-scrolling">
        <div className="sticky top-0 flex items-center py-1.5 px-1.5 z-10 bg-gray-50 border-b border-gray-200">
          {/* Previous month button */}
          <button onClick={this.handlePrevMonth.bind(this)} className="text-gray-600 pt-2 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-11"></div>
          {/* Next month button */}
          <button onClick={this.handleNextMonth.bind(this)} className="text-gray-600 ml-0.5 pt-2 p-1.5 hover:bg-gray-100 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="flex-grow"></div>
          {/* today button */}
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
                if ((this.min && year <= this.min[0] && index <= this.min[1]) || (this.max && year >= this.max[0] && index >= this.max[1])) {
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
