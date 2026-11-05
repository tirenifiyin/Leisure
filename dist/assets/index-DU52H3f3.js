(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const t of a)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function o(a){const t={};return a.integrity&&(t.integrity=a.integrity),a.referrerPolicy&&(t.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?t.credentials="include":a.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(a){if(a.ep)return;a.ep=!0;const t=o(a);fetch(a.href,t)}})();const L="daylight-planner-v2",M="daylight-tasks-v1",N=document.querySelector("#app"),y=T(new Date);let p=z(),d=y,w=new Date(new Date().getFullYear(),new Date().getMonth(),1),k="all",$="tasks",S="530070000600195000098000060800060003400803001700020006060000280000419005000080079".split("").map(Number),b=Array(25).fill(""),m=localStorage.getItem("daylight-theme")||"day";function T(e){const s=e.getFullYear(),o=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${s}-${o}-${r}`}function z(){try{const e=localStorage.getItem(L),s=JSON.parse(e||localStorage.getItem(M)||"[]");return Array.isArray(s)?s.filter(o=>o&&typeof o.id=="string"&&typeof o.text=="string").map(o=>({date:o.date||y,notified:!!o.notified,...o})):[]}catch{return[]}}function E(){localStorage.setItem(L,JSON.stringify(p))}function h(e=""){return String(e).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s])}function A(e,s={weekday:"long",month:"long",day:"numeric"}){return new Intl.DateTimeFormat(void 0,s).format(new Date(`${e}T12:00:00`))}function D(e){return e?new Intl.DateTimeFormat(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(e)):""}function q(e){return`<li class="task-row ${e.done?"is-done":""}" data-id="${h(e.id)}">
    <button 
    class="check-button"
     type="button" 
     data-action="toggle" 
     aria-label="${e.done?"Mark incomplete":"Mark complete"}: ${h(e.text)}"><span>${e.done?"✓":""}</span></button>
    <div 
    class="task-copy">
      <span class="task-text">${h(e.text)}</span>
      <span class="task-meta">
        ${e.deadline?`⏰ Due ${h(D(e.deadline))}`:""}
        ${e.reminder?`　🔔 ${h(D(e.reminder))}`:""}
        </span>
        </div>
    <button 
      class="edit-button" 
      type="button" 
      data-action="edit" 
      aria-label="Edit task title">✎</button>
    <button 
    class="delete-button" 
    type="button" 
    data-action="delete" 
    aria-label="Delete task">×</button>
  </li>`}function O(){const e=w.getFullYear(),s=w.getMonth(),o=new Date(e,s,1).getDay(),r=new Date(e,s+1,0).getDate(),a=[];for(let t=0;t<o;t+=1)a.push('<span class="calendar-blank"></span>');for(let t=1;t<=r;t+=1){const n=T(new Date(e,s,t)),i=p.filter(l=>l.date===n).length;a.push(`<button type="button" class="calendar-day ${n===d?"chosen":""} ${n===y?"is-today":""}" data-date="${n}" aria-label="${A(n)}${i?`, ${i} tasks`:""}">${t}${i?`<i>${Math.min(i,9)}</i>`:""}</button>`)}return`<section class="calendar-card card">
    <div 
    class="calendar-head">
      <div>
        <p class="section-kicker">PICK A DAY</p>
        <h2>${new Intl.DateTimeFormat(void 0,{month:"long",year:"numeric"}).format(w)}</h2>
        </div>
      <div
       class="month-controls">
        <button 
        type="button" 
        data-month="-1" 
        aria-label="Previous month">‹</button>
        <button 
        type="button" 
        data-month="1" 
        aria-label="Next month">›</button>
        </div>
         </div>
    <div 
    class="calendar-grid calendar-weekdays">${["S","M","T","W","T","F","S"].map(t=>`<span>${t}</span>`).join("")}</div>
    <div 
    class="calendar-grid">${a.join("")}
    </div>
   </section>
   `}function P(){const e=p.filter(a=>a.date===d),s=e.filter(a=>k==="all"||(k==="active"?!a.done:a.done)),o=e.filter(a=>a.done).length,r=e.length?Math.round(o/e.length*100):0;return`<section class="section-intro"><p class="eyebrow">A LITTLE SPACE TO RESET</p><h1>Make today<br><span>count.</span></h1><p class="date-line">${A(d)} ${d===y?"· Today":""}</p></section>
    <div 
    class="planner-layout">${O()}
    <section 
    class="planner-card card" 
    aria-label="Tasks for ${A(d)}">
      <div
       class="card-heading">
        <div>
          <p class="section-kicker">YOUR PLAN</p>
          <h2>${d===y?"Today’s tasks":"Your tasks"} 
            <span class="task-count">${e.length}</span>
            </h2>
            </div>
            <div
             class="progress-ring" 
             style="--progress:${r*3.6}deg">
              <span>${r}<small>%</small></span>
              </div>
              </div>
      <form 
      class="task-form" 
      id="task-form">
        <label
         class="sr-only"
          for="task-input">
            Task name
            </label>
            <input 
            id="task-input" 
            maxlength="120" 
            placeholder="What would you like to get done?"
             autocomplete="off" required />
             <button 
             class="add-button" 
             type="submit">
              <span>
                +
                </span>
                <span 
                class="add-label">
                  Add task
                  </span>
                  </button>
        <label 
        class="field-label">
          Day
          <input
           type="date"
            name="task-date" 
            value="${d}" required />
            </label>
            <label
             class="field-label">
              Deadline 
              <input 
              type="datetime-local"
               name="deadline" />
               </label>
               <label 
               class="field-label">
                Reminder
                 <input 
                 type="datetime-local"
                  name="reminder" />
                  </label>
      </form>
      <button 
      class="notify-button" 
      type="button"
       data-action="enable-notifications">
        🔔 Enable reminders
        </button>
      <div 
      class="list-toolbar">
        <span 
        class="list-caption">
          YOUR LIST
           <span
            class="caption-line">
              </span>
              </span>
              <div
               class="filters" 
               role="group"
                aria-label="Filter tasks">
                  ${[["all","All"],["active","To do"],["done","Done"]].map(([a,t])=>`
                  <button class="filter-button ${k===a?"selected":""}" data-filter="${a}" type="button">${t}</button>`).join("")}</div></div>
      <ul
       class="task-list" 
       aria-live="polite">
        ${s.length?s.map(q).join(""):`
        <li 
        class="empty-state">
        <span class="empty-sun">☼</span>
        <strong>
        ${e.length?"Nothing in this view.":"A fresh page."}
        </strong>
        <span>
        ${e.length?"Try another filter or add a task.":"Add something lovely to your day."}
        </span>
        </li>`}
        </ul>
      <footer 
         class="card-footer">
          <span class="footer-spark">
            ✳
            </span>
            <span>
              ${e.length&&o===e.length?"Everything on your list is done. Beautiful work!":"One step at a time is still progress."}
              </span>
               <span
                class="footer-progress">
                  ${o} OF ${e.length} 
                  DONE
                  </span>
                  </footer>
                </section>
                  </div>
    `}function Y(){const e=Array.from({length:7},(n,i)=>{const l=new Date;return l.setDate(l.getDate()-(6-i)),T(l)}),s=p.filter(n=>e.includes(n.date)),o=s.filter(n=>n.done).length,r=s.length?Math.round(o/s.length*100):0,a=r>=80?"Superstar":r>=55?"Steady star":r>=25?"Growing":s.length?"Fresh start":"Rest & reset",t=e.map(n=>{const i=s.filter(g=>g.date===n),l=i.filter(g=>g.done).length;return`<div class="week-day"><div class="bar-track"><i style="height:${i.length?Math.max(8,Math.round(l/i.length*100)):4}%" title="${l} of ${i.length} tasks"></i></div><strong>${l}/${i.length}</strong><span>${A(n,{weekday:"short"})}</span></div>`}).join("");return`<section class="section-intro compact"><p class="eyebrow">A MOMENT TO LOOK BACK</p><h1>Your week,<br><span>in bloom.</span></h1><p class="date-line">The last seven days, one little win at a time.</p></section>
    <section 
       class="weekly-card card">
        <div class="weekly-top">
          <div>
            <p class="section-kicker">YOUR PRODUCTIVITY RATING</p>
            <h2>${a} 
              <span
               class="rating-emoji">
                ${r>=80?"🌟":r>=55?"🌼":"🌱"}
                </span>
                </h2>
                <p class="weekly-copy">${s.length?`${o} of ${s.length} tasks finished`:"Add a few tasks this week to see your wrap-up."}</p></div><div class="rating-bubble">${r}<small>/100</small></div></div>
      <div 
      class="week-chart">
        ${t}
        </div>
        <div 
        class="wrap-note">${r>=80?"You showed up for yourself all week. Look at you go!":"Every small step counts. Be kind to yourself and keep going."}</div></section>`}function I(){const e="530070000600195000098000060800060003400803001700020006060000280000419005000080079".split("").map(Number),s=S.map((r,a)=>{const t=e[a]!==0;return`<input class="sudoku-cell ${t?"fixed":""} ${a%9===2||a%9===5?"box-right":""} ${Math.floor(a/9)%3===2?"box-bottom":""}" inputmode="numeric" maxlength="1" data-sudoku="${a}" value="${r||""}" ${t?"readonly":""} aria-label="Sudoku row ${Math.floor(a/9)+1}, column ${a%9+1}" />`}).join(""),o=Array.from({length:25},(r,a)=>{const t=Math.floor(a/5),n=a%5;return t===2||n===2?`<input class="crossword-cell" maxlength="1" data-crossword="${a}" value="${h(b[a])}" aria-label="Crossword row ${t+1}, column ${n+1}" />`:'<span class="crossword-gap"></span>'}).join("");return`<section class="section-intro compact"><p class="eyebrow">PLAY A LITTLE</p><h1>Brain breaks<br><span>for you.</span></h1><p class="date-line">A playful pause is productive, too.</p></section>
    <div
     class="puzzle-layout">
      <section
       class="puzzle-card card">
        <div class="puzzle-title">
          <span class="puzzle-sticker">🔢</span>
          <div>
            <p class="section-kicker">PUZZLE 01</p>
            <h2>Sudoku</h2>
            </div>
            </div>
            <p class="puzzle-instructions">Fill each row, column, and 3×3 box with the numbers 1–9.</p><div class="sudoku-grid">${s}</div><button class="soft-button" type="button" data-action="check-sudoku">Check my grid</button></section>
    <section 
    class="puzzle-card card">
      <div class="puzzle-title">
        <span class="puzzle-sticker">🧩</span>
        <div>
          <p class="section-kicker">PUZZLE 02</p>
          <h2>Mini crossword</h2>
          </div>
           </div>
           <p class="puzzle-instructions">Type one letter in each sunny square.</p>
           <div 
           class="crossword-grid">${o}
           </div>
           <div
            class="clues">
              <p>
                <b>Across · 1</b> A living thing that grows in soil (5)</p>
                <p>
                  <b>Down · 2</b> A legless reptile (5)</p>
                  </div>
                  <button 
                  class="soft-button" 
                  type="button" 
                  data-action="check-crossword">
                    Check my answers
                    </button>
                    </section>
                    </div>
                    `}function f(){const e=$==="weekly"?Y():$==="puzzles"?I():P();N.innerHTML=`<main class="page-shell" data-theme="${m}">
                    <header
                     class="topbar">
                      <a class="brand" href="#" aria-label="Ìràwọ̀ home"><span class="brand-mark">✳</span> Ìràwọ̀</a><div class="top-actions"><span class="today-pill"><span class="live-dot"></span> YOUR DAILY SPACE</span><button class="theme-toggle" type="button" data-action="theme" aria-label="Switch to ${m==="day"?"night":"day"} mode">${m==="day"?"🌙":"☀️"} <span>${m==="day"?"Night":"Day"}</span></button></div></header>
    <nav 
    class="main-nav" 
    aria-label="Main sections">${[["tasks","☀️","My days"],["weekly","📊","Weekly wrap"],["puzzles","🧩","Puzzles"]].map(([s,o,r])=>`
      <button
       type="button" 
       class="nav-button ${$===s?"active":""}" data-section="${s}"><span>${o}</span>${r}
       </button>`).join("")}
       </nav>
    ${e}<p class="offline-note"><span class="offline-icon">◉</span> Your list stays on this device and works offline.</p></main><div class="toast" role="status" aria-live="polite"></div>`,C()}function u(e){const s=document.querySelector(".toast");s&&(s.textContent=e,s.classList.add("visible"),window.clearTimeout(u.timer),u.timer=window.setTimeout(()=>s.classList.remove("visible"),2600))}function C(){var o,r,a;document.querySelectorAll("[data-section]").forEach(t=>t.addEventListener("click",()=>{$=t.dataset.section,f()})),document.querySelector('[data-action="theme"]').addEventListener("click",()=>{m=m==="day"?"night":"day",localStorage.setItem("daylight-theme",m),f()}),document.querySelectorAll("[data-month]").forEach(t=>t.addEventListener("click",()=>{w.setMonth(w.getMonth()+Number(t.dataset.month)),f()})),document.querySelectorAll("[data-date]").forEach(t=>t.addEventListener("click",()=>{d=t.dataset.date,k="all",f()})),document.querySelectorAll(".filter-button").forEach(t=>t.addEventListener("click",()=>{k=t.dataset.filter,f()}));const e=document.querySelector("#task-form");e&&e.addEventListener("submit",async t=>{t.preventDefault();const n=new FormData(e),i=document.querySelector("#task-input").value.trim();if(!i)return;const l=n.get("reminder");if(l&&"Notification"in window&&Notification.permission==="default")try{await Notification.requestPermission()}catch{}p.unshift({id:crypto.randomUUID(),text:i,done:!1,date:n.get("task-date"),deadline:n.get("deadline")||"",reminder:l||"",notified:!1}),E(),d=n.get("task-date"),f(),u("Task added to your day!")});const s=document.querySelector(".task-list");s&&s.addEventListener("click",t=>{const n=t.target.closest("[data-action]");if(!n)return;const i=n.closest(".task-row"),l=p.find(c=>c.id===(i==null?void 0:i.dataset.id));if(l){if(n.dataset.action==="toggle"&&(l.done=!l.done,l.completedAt=l.done?y:""),n.dataset.action==="delete"&&(p=p.filter(c=>c.id!==l.id)),n.dataset.action==="edit"){const c=window.prompt("Edit your task title",l.text);if(c===null)return;if(!c.trim()){u("A task needs a name");return}l.text=c.trim()}E(),f()}}),(o=document.querySelector('[data-action="enable-notifications"]'))==null||o.addEventListener("click",async()=>{if(!("Notification"in window)){u("Notifications are not supported in this browser");return}const t=await Notification.requestPermission();u(t==="granted"?"Reminders are enabled while Ìràwọ̀ is open":"Allow notifications in your browser settings")}),document.querySelectorAll("[data-sudoku]").forEach(t=>t.addEventListener("input",()=>{const n=Number(t.dataset.sudoku),i=t.value.replace(/[^1-9]/g,"").slice(-1);S[n]=Number(i)||0,t.value=i})),(r=document.querySelector('[data-action="check-sudoku"]'))==null||r.addEventListener("click",()=>{const t=S.every((n,i)=>{if(!n)return!1;const l=Math.floor(i/9),c=i%9;return S.every((g,v)=>v===i||g!==n||Math.floor(v/9)!==l&&v%9!==c&&(Math.floor(Math.floor(v/9)/3)!==Math.floor(l/3)||Math.floor(v%9/3)!==Math.floor(c/3)))});u(t?"Sudoku solved! Look at that brain!":"Not quite yet—check each row, column, and box.")}),document.querySelectorAll("[data-crossword]").forEach(t=>t.addEventListener("input",()=>{const n=Number(t.dataset.crossword);b[n]=t.value.toUpperCase().replace(/[^A-Z]/g,"").slice(-1),t.value=b[n]})),(a=document.querySelector('[data-action="check-crossword"]'))==null||a.addEventListener("click",()=>{const t=[10,11,12,13,14].map(i=>b[i]).join(""),n=[2,7,12,17,22].map(i=>b[i]).join("");u(t==="PLANT"&&n==="SNAKE"?"Both clues solved! You’re a word wizard!":"Keep puzzling—Across starts with P, Down starts with S.")})}function F(){const e=Date.now();let s=!1;for(const o of p)!o.done&&o.reminder&&!o.notified&&new Date(o.reminder).getTime()<=e&&(o.notified=!0,s=!0,"Notification"in window&&Notification.permission==="granted"?new Notification("Ìràwọ̀ reminder",{body:o.text,icon:"/icon.svg",tag:o.id}):u(`Reminder: ${o.text}`));s&&E()}f();window.setInterval(F,2e4);"serviceWorker"in navigator&&window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
