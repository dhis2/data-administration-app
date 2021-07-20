import i18n from '@dhis2/d2-i18n'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import PropTypes from 'prop-types'
import React from 'react'

const getFirstDateOfWeek = (year, week) => {
    const ordTable = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    const ordTableLeap = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335]
    const isLeapYear =
        new Date(new Date(year, 2, 1).setDate(0)).getDate() === 29
    const ordDiff = isLeapYear ? ordTableLeap : ordTable

    const correction = (new Date(year, 0, 4).getDay() || 7) + 3
    const ordDate = week * 7 + (1 - correction)
    if (ordDate < 0) {
        return new Date(year, 0, ordDate)
    }

    let month = 11
    while (ordDate < ordDiff[month]) {
        month--
    }

    return new Date(year, month, ordDate - ordDiff[month])
}

const is53WeekISOYear = year => {
    const p = y =>
        y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400)

    return p(year) % 7 === 4 || p(year - 1) % 7 === 3
}

const styles = {
    datePicker: { width: '100%' },
    line: { marginTop: 0 },
}

const getYear = date => new Date(date).getFullYear().toString()
const getTwoDigitMonth = date => {
    const month = new Date(date).getMonth() + 1 // Month is 0 indexed

    return `0${month}`.slice(-2)
}
const getTwoDigitDay = date => {
    const day = new Date(date).getDate()

    return `0${day}`.slice(-2)
}
const formattedDate = date =>
    `${getYear(date)}${getTwoDigitMonth(date)}${getTwoDigitDay(date)}`
const getWeekYear = date => {
    // Create a new date object for the thursday of this week
    const target = new Date(date)
    target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3)

    return target.getFullYear()
}
const isWeekValid = (date, week) =>
    // It's not possible to have a week 53 in a 52 week year
    !is53WeekISOYear(date) && Number(week) !== 53
const biWeekToWeek = biWeekStr => parseInt(biWeekStr) * 2 - 1

class PeriodPicker extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    getTranslation(key) {
        const periodTypeLabels = {
            week: i18n.t('week'),
            month: i18n.t('month'),
            year: i18n.t('year'),
            biWeek: i18n.t('bi weekly'),
            biMonth: i18n.t('bi monthly'),
            day: i18n.t('day'),
            jan: i18n.t('jan'),
            feb: i18n.t('feb'),
            mar: i18n.t('mar'),
            apr: i18n.t('apr'),
            may: i18n.t('may'),
            jun: i18n.t('jun'),
            jul: i18n.t('jul'),
            aug: i18n.t('aug'),
            sep: i18n.t('sep'),
            oct: i18n.t('oct'),
            nov: i18n.t('nov'),
            dec: i18n.t('dec'),
            'jan-feb': i18n.t('jan-feb'),
            'mar-apr': i18n.t('mar-apr'),
            'may-jun': i18n.t('may-jun'),
            'jul-aug': i18n.t('jul-aug'),
            'sep-oct': i18n.t('sep-oct'),
            'nov-dec': i18n.t('nov-dec'),
            quarter: i18n.t('quarter'),
            Q1: i18n.t('Q1'),
            Q2: i18n.t('Q2'),
            Q3: i18n.t('Q3'),
            Q4: i18n.t('Q4'),
            sixMonth: i18n.t('six monthly'),
            'jan-jun': i18n.t('jan-jun'),
            'jul-dec': i18n.t('jul-dec'),
            'apr-sep': i18n.t('apr-sep'),
            'oct-mar': i18n.t('oct-mar'),
        }
        return periodTypeLabels[key] || key
    }

    componentDidUpdate(prevProps) {
        if (this.props.periodType !== prevProps.periodType) {
            this.handleChange()
        }
    }

    getPeriod() {
        const week =
            this.props.periodType === 'BiWeekly' && this.state.biWeek
                ? biWeekToWeek(this.state.biWeek)
                : this.state.week
        const date =
            this.state.year && week && getFirstDateOfWeek(this.state.year, week)

        switch (this.props.periodType) {
            case 'Daily':
                return this.state.date && formattedDate(this.state.date)
            case 'Weekly':
                if (date) {
                    this.setState({
                        invalidWeek: !isWeekValid(date, this.state.week),
                    })
                }
                return (
                    date &&
                    isWeekValid(date, this.state.week) &&
                    `${getWeekYear(date)}W${this.state.week}`
                )
            case 'WeeklyWednesday':
                if (date) {
                    this.setState({
                        invalidWeek: !isWeekValid(date, this.state.week),
                    })
                }
                return (
                    date &&
                    isWeekValid(date, this.state.week) &&
                    `${getWeekYear(date)}WedW${this.state.week}`
                )
            case 'WeeklyThursday':
                if (date) {
                    this.setState({
                        invalidWeek: !isWeekValid(date, this.state.week),
                    })
                }
                return (
                    date &&
                    isWeekValid(date, this.state.week) &&
                    `${getWeekYear(date)}ThuW${this.state.week}`
                )
            case 'WeeklySaturday':
                if (date) {
                    this.setState({
                        invalidWeek: !isWeekValid(date, this.state.week),
                    })
                }
                return (
                    date &&
                    isWeekValid(date, this.state.week) &&
                    `${getWeekYear(date)}SatW${this.state.week}`
                )
            case 'WeeklySunday':
                if (date) {
                    this.setState({
                        invalidWeek: !isWeekValid(date, this.state.week),
                    })
                }
                return (
                    date &&
                    isWeekValid(date, this.state.week) &&
                    `${getWeekYear(date)}SunW${this.state.week}`
                )
            case 'BiWeekly':
                if (date) {
                    this.setState({
                        invalidBiWeek: !isWeekValid(
                            date,
                            biWeekToWeek(this.state.biWeek)
                        ),
                    })
                }
                return (
                    this.state.year &&
                    this.state.biWeek &&
                    `${this.state.year}BiW${this.state.biWeek}`
                )
            case 'Monthly':
                return (
                    this.state.year &&
                    this.state.month &&
                    `${this.state.year}${this.state.month}`
                )
            case 'BiMonthly':
                return (
                    this.state.year &&
                    this.state.biMonth &&
                    `${this.state.year}0${this.state.biMonth}B`
                )
            case 'Quarterly':
                return (
                    this.state.year &&
                    this.state.quarter &&
                    `${this.state.year}Q${this.state.quarter}`
                )
            case 'SixMonthly':
                return (
                    this.state.year &&
                    this.state.sixMonth &&
                    `${this.state.year}S${this.state.sixMonth}`
                )
            case 'SixMonthlyApril':
                return (
                    this.state.year &&
                    this.state.sixMonth &&
                    `${this.state.year}AprilS${this.state.sixMonth}`
                )
            case 'SixMonthlyNov':
                return (
                    this.state.year &&
                    this.state.sixMonth &&
                    `${this.state.year}NovS${this.state.sixMonth}`
                )
            case 'Yearly':
                return this.state.year
            case 'FinancialApril':
                return this.state.year && `${this.state.year}April`
            case 'FinancialJuly':
                return this.state.year && `${this.state.year}July`
            case 'FinancialOct':
                return this.state.year && `${this.state.year}Oct`

            default:
                return false
        }
    }

    handleChange() {
        if (this.getPeriod()) {
            this.props.onPickPeriod(this.getPeriod())
        }
    }

    renderOptionPicker(name, options) {
        const handleChange = ({ selected }) =>
            this.setState({ [name]: selected }, this.handleChange)
        const isInvalid =
            (name === 'week' && this.state.invalidWeek) ||
            (name === 'biWeek' && this.state.invalidBiWeek)

        return (
            <div
                style={{ display: 'inline-block' }}
                data-test={`period-picker-option-${name}`}
            >
                <SingleSelectField
                    label={this.getTranslation(name)}
                    selected={this.state[name]}
                    onChange={handleChange}
                    error={isInvalid}
                >
                    {Object.keys(options)
                        .sort()
                        .map(value => (
                            <SingleSelectOption
                                key={value}
                                label={
                                    /[^0-9]/.test(options[value]) &&
                                    name !== 'biWeek'
                                        ? this.getTranslation(options[value])
                                        : options[value]
                                }
                                value={value}
                            />
                        ))}
                </SingleSelectField>
            </div>
        )
    }

    renderYearPicker() {
        const years = {}
        const currentYear = new Date().getFullYear()
        for (let year = 2014; year < currentYear + 5; year++) {
            years[year] = year
        }

        return this.renderOptionPicker('year', years)
    }

    renderMonthPicker() {
        const months = {
            '01': 'jan',
            '02': 'feb',
            '03': 'mar',
            '04': 'apr',
            '05': 'may',
            '06': 'jun',
            '07': 'jul',
            '08': 'aug',
            '09': 'sep',
            10: 'oct',
            11: 'nov',
            12: 'dec',
        }
        return this.renderOptionPicker('month', months)
    }

    renderWeekPicker() {
        const weeks = {}
        const weekLimit = 53
        for (let week = 1; week <= weekLimit; week++) {
            weeks[`0${week}`.substr(-2)] = week
        }

        return this.renderOptionPicker('week', weeks)
    }

    renderBiWeekPicker() {
        const biWeeks = {}
        const biWeekLimit = 27
        const prefix = this.getTranslation('biWeek')
        for (let biWeek = 1; biWeek <= biWeekLimit; biWeek++) {
            biWeeks[`0${biWeek}`.substr(-2)] = `${prefix} ${biWeek}`
        }

        return this.renderOptionPicker('biWeek', biWeeks)
    }

    renderBiMonthPicker() {
        const biMonths = {
            1: 'jan-feb',
            2: 'mar-apr',
            3: 'may-jun',
            4: 'jul-aug',
            5: 'sep-oct',
            6: 'nov-dec',
        }
        return this.renderOptionPicker('biMonth', biMonths)
    }

    renderQuarterPicker() {
        const quarters = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4' }
        return this.renderOptionPicker('quarter', quarters)
    }

    render() {
        const setDateState = (nothing, date) => {
            const year = getYear(date)
            const month = getTwoDigitMonth(date)
            this.setState({ date, year, month }, this.handleChange)
        }

        switch (this.props.periodType) {
            case 'Daily':
                return (
                    <DatePicker
                        floatingLabelText={this.getTranslation('day')}
                        onChange={setDateState}
                        autoOk
                        container="inline"
                        style={styles.datePicker}
                    />
                )
            case 'Weekly':
            case 'WeeklyWednesday':
            case 'WeeklyThursday':
            case 'WeeklySaturday':
            case 'WeeklySunday':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderWeekPicker()}
                    </div>
                )
            case 'BiWeekly':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderBiWeekPicker()}
                    </div>
                )
            case 'Monthly':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderMonthPicker()}
                    </div>
                )
            case 'BiMonthly':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderBiMonthPicker()}
                    </div>
                )
            case 'Quarterly':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderQuarterPicker()}
                    </div>
                )
            case 'SixMonthly':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderOptionPicker('sixMonth', {
                            1: 'jan-jun',
                            2: 'jul-dec',
                        })}
                    </div>
                )
            case 'SixMonthlyApril':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderOptionPicker('sixMonth', {
                            1: 'apr-sep',
                            2: 'oct-mar',
                        })}
                    </div>
                )
            case 'SixMonthlyNov':
                return (
                    <div style={styles.line}>
                        {this.renderYearPicker()}
                        {this.renderOptionPicker('sixMonth', {
                            1: 'nov-apr',
                            2: 'may-oct',
                        })}
                    </div>
                )
            case 'Yearly':
            case 'FinancialApril':
            case 'FinancialJuly':
            case 'FinancialOct':
                return <div style={styles.line}>{this.renderYearPicker()}</div>

            default:
                return null
        }
    }
}

PeriodPicker.propTypes = {
    periodType: PropTypes.oneOf([
        'Daily',
        'Weekly',
        'WeeklyWednesday',
        'WeeklyThursday',
        'WeeklySaturday',
        'WeeklySunday',
        'BiWeekly',
        'Monthly',
        'BiMonthly',
        'Quarterly',
        'SixMonthly',
        'SixMonthlyApril',
        'SixMonthlyNov',
        'Yearly',
        'FinancialApril',
        'FinancialJuly',
        'FinancialOct',
    ]).isRequired,
    onPickPeriod: PropTypes.func.isRequired,
}

export default PeriodPicker
