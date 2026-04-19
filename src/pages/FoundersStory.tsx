import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Masthead } from "@/components/founder/Masthead";
import { Section } from "@/components/founder/Section";
import { PullQuote } from "@/components/founder/PullQuote";
import { Timeline } from "@/components/founder/Timeline";
import { Closing } from "@/components/founder/Closing";
import styles from "@/components/founder/FoundersStory.module.css";

const timelineItems = [
  {
    date: "Housing",
    text: "Fighting her housing authority over a bedroom-size accommodation required by her foster care license. The accommodation request had been misrouted between departments for months. She built a detailed fair housing argument combining federal statutes, HUD guidance, and regulatory requirements — then prepared for a formal hearing, alone, with days to submit evidence.",
  },
  {
    date: "Child Welfare",
    text: "Managing her foster daughter's dependency case in court, producing dozens of formal documents for attorney briefing and submission. Simultaneously, a child protective services intake had been filed regarding her son — containing allegations directly contradicted by documented evidence and a witness whose account changed materially within 48 hours.",
  },
  {
    date: "Foster Licensing",
    text: "Maintaining her active kinship foster care license — a process requiring compliance documentation, formal agency correspondence, and demonstrated stability — while in active crisis across every other system at the same time.",
  },
  {
    date: "Legislation",
    text: "Developing a full legislative advocacy packet to complete implementation of a Washington State youth behavioral health law — including a bill draft, policy framework, and advocacy toolkit targeting state legislators — because the gaps in the law were gaps she had watched harm people firsthand.",
  },
  {
    date: "Platform",
    text: "Building Decoded Justice. Not as a future project. As survival infrastructure — because she was learning everything too late, and she could not stop the clock for anyone else going through the same thing.",
  },
];

const setMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "content") {
        tag?.setAttribute(key, value);
      }
    });
    document.head.appendChild(tag);
  }
  if (tag) {
    tag.setAttribute("content", attributes.content);
  }
};

export default function FoundersStory() {
  useEffect(() => {
    document.title = "Founder's Story — Decoded Justice";
    setMetaTag('meta[name="description"]', {
      name: "description",
      content: "How Decoded Justice was built from real experience navigating civil rights, housing, and child welfare systems simultaneously.",
    });
    setMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: "Founder's Story — Decoded Justice",
    });
    setMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: "How Decoded Justice was built from real experience navigating civil rights, housing, and child welfare systems simultaneously.",
    });
    setMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "article",
    });
  }, []);

  return (
    <Layout>
      <article className={styles.storyPage}>
        <Masthead />

        <main className={styles.storyWrap}>
          <p className={styles.lede}>
            This platform was not designed in a boardroom. It was built in the hours after midnight, by someone who was simultaneously managing a federal civil rights case, a foster care licensing fight, a housing authority battle, a child welfare court matter, and a young son who deserved a mother who wasn't drowning.
          </p>

          <Section label="The Beginning" title="It Started With Something Done to Her" style={{ animationDelay: "0.15s" }}>
            <p className={styles.bodyParagraph}>The founder of Decoded Justice was a passenger in a vehicle when her life changed. What followed was a law enforcement encounter involving excessive force — a multi-agency pursuit, repeated vehicle rammings at highway speeds, and a use of force that left her partner unconscious and hospitalized in intensive care with serious neurological injuries.</p>
            <p className={styles.bodyParagraph}>She was uninjured physically but left with severe PTSD, dental damage from the incident, and a legal situation she had no preparation for. Her partner could not advocate for himself. Their young son was affected. And neither of them had an attorney.</p>
            <p className={styles.bodyParagraph}>She had police reports. She had dashcam evidence. She had medical records. She had documentation showing that a supervisor had ordered the officers to stand down — and that order had been ignored before the most serious force was used.</p>
            <p className={styles.bodyParagraph}>What she did not have was anyone to help her understand what to do with any of it.</p>
          </Section>

          <PullQuote
            quote="Your situation sounds like a nightmare — but what you've built here reflects a level of preparation most represented clients don't achieve."
            cite="— Civil rights attorney, upon reviewing case materials"
          />

          <Section label="The Self-Education" title="Learning What No One Will Teach You" style={{ animationDelay: "0.22s" }}>
            <p className={styles.bodyParagraph}>She did not have a legal background. She had a case, a deadline, and no alternative.</p>
            <p className={styles.bodyParagraph}>She taught herself evidence preservation — how documents are authenticated, how metadata matters, how chain of custody works. She studied federal civil rights law and court procedure. She learned how police agencies document use of force, how internal investigations are structured, and what the gap between an officer's narrative and dashcam footage can mean legally.</p>
            <p className={styles.bodyParagraph}>She obtained the complete documentary record — incident reports, investigation files, use-of-force documentation, dispatch logs, medical records, and communications — and organized everything into a litigation binder with an evidence matrix and constitutional violation analysis. She calculated damages. She prepared attorney outreach that described the timeline with forensic precision, because she had learned that attorneys evaluate cases on facts, not feelings.</p>
            <p className={styles.bodyParagraph}>When attorneys reviewed her materials, they told her the work was exceptional. What they could not see was what building it had cost her.</p>
          </Section>

          <Section label="The Real Weight" title="She Was Not Navigating One System. She Was Navigating All of Them." style={{ animationDelay: "0.29s" }}>
            <p className={styles.bodyParagraph}>While building her civil rights case, she was managing everything else at the same time:</p>
            <Timeline items={timelineItems} />
          </Section>

          <PullQuote
            quote="She did not build Decoded Justice after surviving the systems. She built it while they were still running her through."
            cite="— The Founder's Story"
          />

          <Section label="The Realization" title="The System Does Not Explain Itself. That Is Not an Accident." style={{ animationDelay: "0.36s" }}>
            <p className={styles.bodyParagraph}>Every document she produced — the evidence matrix, the housing accommodation brief, the licensing correspondence, the child welfare declarations, the legislative packet — represented knowledge that took months to acquire under extreme pressure and that should have been available from day one.</p>
            <p className={styles.bodyParagraph}>The patterns were not random. Housing authorities misroute accommodation requests. Child welfare agencies produce declarations they expect will go unchallenged. Police reports contain discrepancies between written narratives and recorded evidence. Courts have deadlines that move silently. The systems that intersect each other — housing and foster care, child welfare and criminal justice, benefits and health — do not connect those dots for the people caught between them.</p>
            <p className={styles.bodyParagraph}>She built the tools she needed. By the time she had them, she had already lost ground she could not get back.</p>
            <p className={styles.bodyParagraph}>
              <strong className={styles.strong}>Decoded Justice exists so that other people do not have to build those tools from scratch, at midnight, while in crisis, alone.</strong>
            </p>
          </Section>

          <Section label="The Platform" title="What Decoded Justice Is — and What It Isn't" style={{ animationDelay: "0.43s" }}>
            <p className={styles.bodyParagraph}>Decoded Justice is a trauma-informed civil rights legal technology platform focused on Washington State. It has over two dozen feature areas covering the systems that most frequently intersect in civil rights and government accountability matters — law enforcement, housing, child welfare, public benefits, and courts. It is built entirely by its founder, on an iPad, using modern development tools learned alongside everything else in this story.</p>
            <p className={styles.bodyParagraph}>The platform does not provide legal advice. That is the domain of attorneys. What it provides is something attorneys cannot always give: <strong className={styles.strong}>the preparation that makes legal help possible</strong>. The structure that transforms chaos into something a professional can act on. The language that explains which system you're in, what typically happens there, what documentation matters, and what deadlines are moving before they pass.</p>
            <p className={styles.bodyParagraph}>It was designed for the person who learns that asking for clarity gets used against them. For the parent who cannot show vulnerability without risking custody. For the trauma survivor who is still expected to navigate federal procedure without error. For the person managing multiple intersecting government systems while raising children and trying to heal.</p>
            <p className={styles.bodyParagraph}>Its guiding principle:</p>
            <p className={styles.italicBlock}>The most important guide is the one that exists. Better to help one person in crisis today than a hundred people someday.</p>
          </Section>

          <Section label="The Person Behind It" title="Who the Founder Is" style={{ animationDelay: "0.5s" }}>
            <p className={styles.bodyParagraph}>She is a licensed kinship foster caregiver in Washington State, a housing voucher holder who has navigated — and challenged — one of the state's largest housing authorities. She is an active pro se civil rights litigant. She is a policy advocate who has drafted legislation. She is a mother to a young son and a foster daughter whose dependency case she has fought to influence at every available legal moment.</p>
            <p className={styles.bodyParagraph}>She is writing a non-fiction personal narrative — <em>Between the Cracks</em> — because the story that produced this platform deserves to be told in full, not summarized.</p>
            <p className={styles.bodyParagraph}>And she still finds time for art. For creative work. For the detail-oriented projects that bring beauty into spaces that have none. Not as a luxury — but because staying whole, when the world keeps working to take you apart, is its own form of resistance.</p>
          </Section>

          <Closing style={{ animationDelay: "0.57s" }} />
        </main>
      </article>
    </Layout>
  );
}
