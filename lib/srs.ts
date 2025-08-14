export type Rating = 'again'|'hard'|'good'|'easy';
export function nextSchedule(ease=2.5, interval=0, rating: Rating){
  let e=ease, i=interval;
  if (rating==='again'){ e=Math.max(1.3,e-0.2); i=1; }
  if (rating==='hard'){ e=Math.max(1.3,e-0.15); i=Math.ceil(Math.max(1,i*1.2)); }
  if (rating==='good'){ i=Math.ceil(Math.max(1,i*e)); }
  if (rating==='easy'){ e=e+0.05; i=Math.ceil(Math.max(1,i*e*1.3)); }
  const dueAt = new Date(); dueAt.setDate(dueAt.getDate()+i);
  return { ease:e, interval:i, dueAt: dueAt.toISOString() };
}


