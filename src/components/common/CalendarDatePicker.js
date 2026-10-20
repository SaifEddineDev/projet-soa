import React, { useEffect, useMemo, useRef, useState } from 'react';
import './CalendarDatePicker.css';

const parseISODate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

const toISODate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const formatDate = (date) => date ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date) : '';
const parseFrenchDate = (value) => {
  const match = value.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  return parseISODate(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
};

const CalendarDatePicker = ({ id, name, value = '', onChange, required = false, min, className = '', ariaLabel }) => {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const popoverRef = useRef(null);
  const selectedDate = parseISODate(value);
  const [draft, setDraft] = useState(formatDate(selectedDate));
  const [isOpen, setIsOpen] = useState(false);
  const [popoverPlacement, setPopoverPlacement] = useState('');
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = selectedDate || new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const minimumDate = parseISODate(min);
  const weekDays = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'];

  useEffect(() => {
    const next = parseISODate(value);
    setDraft(formatDate(next));
    if (next) setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [value]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const placePopover = () => {
      const inputBounds = inputRef.current?.getBoundingClientRect();
      const popoverBounds = popoverRef.current?.getBoundingClientRect();
      if (!inputBounds || !popoverBounds) return;
      const alignRight = inputBounds.left + popoverBounds.width > window.innerWidth - 12;
      const placeAbove = inputBounds.bottom + popoverBounds.height > window.innerHeight - 12
        && inputBounds.top > popoverBounds.height + 12;
      setPopoverPlacement(`${alignRight ? 'align-right' : ''}${alignRight && placeAbove ? ' ' : ''}${placeAbove ? 'place-above' : ''}`.trim());
    };
    const frame = window.requestAnimationFrame(placePopover);
    const closeOnOutsideClick = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('touchstart', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('touchstart', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const days = useMemo(() => {
    const firstOfMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
      return { date: day, key: toISODate(day), inMonth: day.getMonth() === visibleMonth.getMonth() };
    });
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(visibleMonth);
  const today = new Date();
  const todayISO = toISODate(today);
  const isBeforeMinimum = (date) => minimumDate && date < new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
  const publishDate = (date) => {
    const isoDate = date ? toISODate(date) : '';
    onChange?.({ target: { name, value: isoDate } });
    setDraft(formatDate(date));
    if (date) setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleTextChange = (event) => {
    const nextDraft = event.target.value;
    setDraft(nextDraft);
    const parsed = parseFrenchDate(nextDraft);
    const isValid = !nextDraft || (parsed && !isBeforeMinimum(parsed));
    event.target.setCustomValidity(isValid ? '' : 'Saisissez une date valide au format JJ/MM/AAAA.');
    if (!nextDraft || (parsed && !isBeforeMinimum(parsed))) publishDate(parsed);
  };

  return (
    <div className={`calendar-date-picker${className ? ` ${className}` : ''}`} ref={wrapperRef}>
      <div className="calendar-date-field">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="jj/mm/aaaa"
          value={draft}
          required={required}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onChange={handleTextChange}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && (event.altKey || event.metaKey)) {
              event.preventDefault();
              setIsOpen(true);
            }
          }}
        />
        <button
          type="button"
          className="calendar-date-trigger"
          aria-label={isOpen ? 'Fermer le calendrier' : 'Ouvrir le calendrier'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="3" /><path d="M7.5 3v4M16.5 3v4M4 9.5h16" /></svg>
        </button>
      </div>

      {isOpen && (
        <div ref={popoverRef} className={`calendar-date-popover ${popoverPlacement}`} role="dialog" aria-label="Choisir une date">
          <div className="calendar-date-header">
            <span className="calendar-date-month" aria-live="polite">{monthLabel}</span>
            <div className="calendar-date-navigation">
              <button type="button" aria-label="Mois précédent" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button type="button" aria-label="Mois suivant" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          </div>

          <div className="calendar-date-grid calendar-date-weekdays" aria-hidden="true">
            {weekDays.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-date-grid calendar-date-days">
            {days.map(({ date, key, inMonth }) => {
              const isSelected = key === value;
              const isToday = key === todayISO;
              const disabled = isBeforeMinimum(date);
              return (
                <button
                  type="button"
                  key={key}
                  className={`${inMonth ? '' : 'is-outside-month'}${isSelected ? ' is-selected' : ''}${isToday ? ' is-today' : ''}`}
                  aria-label={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(date)}
                  aria-pressed={isSelected}
                  disabled={disabled}
                  onClick={() => { publishDate(date); setIsOpen(false); inputRef.current?.focus(); }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="calendar-date-footer">
            <button type="button" onClick={() => { publishDate(null); setIsOpen(false); inputRef.current?.focus(); }}>Effacer</button>
            <button type="button" disabled={isBeforeMinimum(today)} onClick={() => { publishDate(today); setIsOpen(false); inputRef.current?.focus(); }}>Aujourd’hui</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDatePicker;
