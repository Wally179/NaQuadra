'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './GameDatePicker.module.css';

interface GameDatePickerProps {
  currentDate: string; // YYYYMMDD
  onDateChange: (date: string) => void;
}

function formatDisplayDate(yyyymmdd: string): string {
  const y = yyyymmdd.substring(0, 4);
  const m = yyyymmdd.substring(4, 6);
  const d = yyyymmdd.substring(6, 8);
  const date = new Date(`${y}-${m}-${d}T12:00:00`);
  
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const dateCheck = new Date(date);
  dateCheck.setHours(12, 0, 0, 0);
  
  const diffDays = Math.round((dateCheck.getTime() - today.getTime()) / (86400000));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === -1) return 'Ontem';
  if (diffDays === 1) return 'Amanhã';
  
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function addDays(yyyymmdd: string, days: number): string {
  const y = parseInt(yyyymmdd.substring(0, 4), 10);
  const m = parseInt(yyyymmdd.substring(4, 6), 10) - 1;
  const d = parseInt(yyyymmdd.substring(6, 8), 10);
  const date = new Date(y, m, d);
  date.setDate(date.getDate() + days);
  
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, '0');
  const nd = String(date.getDate()).padStart(2, '0');
  return `${ny}${nm}${nd}`;
}

function getToday(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function GameDatePicker({ currentDate, onDateChange }: GameDatePickerProps) {
  const isToday = currentDate === getToday();

  return (
    <div className={styles.datePicker}>
      <button
        className={styles.navBtn}
        onClick={() => onDateChange(addDays(currentDate, -1))}
        type="button"
        aria-label="Dia anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <button
        className={`${styles.dateLabel} ${isToday ? styles.dateLabelToday : ''}`}
        onClick={() => onDateChange(getToday())}
        type="button"
      >
        {formatDisplayDate(currentDate)}
      </button>

      <button
        className={styles.navBtn}
        onClick={() => onDateChange(addDays(currentDate, 1))}
        type="button"
        aria-label="Próximo dia"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export { getToday };
