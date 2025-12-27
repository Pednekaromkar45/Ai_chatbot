 # Candidate Conversation Flow – MVP

This document defines the end-to-end chat and voice interaction
between a candidate and the Zodiac AI Screening Assistant.

---

## 1. ENTRY & GREETING

**System Message**
> Hi 👋  
> Welcome to Zodiac HR.  
> I’ll help you with role details and a short screening to understand your fit.

---

## 2. CONSENT CAPTURE (MANDATORY)

**AI**
> Before we begin, may I have your consent to use your responses (including voice)
> only for recruitment screening purposes?

**Options**
- ✅ Yes, I agree
- ❌ No

**Logic**
- If No → End conversation politely
- If Yes → Proceed

---

## 3. JOB CONFIRMATION

**AI**
> You’re being considered for the **{{Job Title}}** role in **{{Location}}**.  
> Is this correct?

**Options**
- ✅ Yes
- ❌ No

**Logic**
- If No → End / reroute
- If Yes → Proceed

---

## 4. FAQ MODE (AI-DRIVEN)

**AI**
> You can ask me anything about:
> - Role & responsibilities
> - Salary range
> - Work mode
> - Interview process
>
> Type **“continue”** when ready for the screening.

**Logic**
- Free-form questions
- AI answers using job + FAQ knowledge
- Loop until candidate types “continue”

---

## 5. TEXT-BASED SCREENING (SKILLS)

### Q1 – Experience
**AI**
> Briefly tell me about your relevant experience for this role.

---

### Q2 – Skill Understanding
**AI**
> What key skills do you think are important for this role, and how comfortable are you with them?

---

### Q3 – Problem Solving
**AI**
> Can you share a situation where you solved a challenging problem at work or during a project?

---

## 6. VOICE-BASED QUESTION (CONFIDENCE & COMMUNICATION)

**AI**
> Please record a short voice response (30–60 seconds):
>
> 👉 *Why are you interested in this role, and why should we consider you?*

**Logic**
- Accept audio upload
- Store file
- Transcribe later
- No real-time analysis here

---

## 7. WILLINGNESS & AVAILABILITY

### Q1 – Salary
**AI**
> What is your expected salary range for this role?

---

### Q2 – Notice Period
**AI**
> What is your current notice period?

---

### Q3 – Availability
**AI**
> If selected, when would you be able to join?

---

## 8. COMPLETION MESSAGE

**AI**
> Thank you for your time 🙏  
> Our team will review your profile and get back to you shortly.
>
> Wishing you all the best!

---

## 9. SYSTEM ACTIONS (POST-CONVERSATION)

- Mark conversation as `completed`
- Trigger AI evaluation:
  - Text screening analysis
  - Voice transcript analysis
  - Willingness scoring
- Generate ScreeningResult
- Make visible on recruiter dashboard

---
