import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Masthead } from "@/components/founder/Masthead";
import { Section } from "@/components/founder/Section";
import { PullQuote } from "@/components/founder/PullQuote";
import { Timeline } from "@/components/founder/Timeline";
import { Closing } from "@/components/founder/Closing";
import founderOgImage from "@/assets/decoded-justice-scales-logo.png";
import styles from "@/components/founder/FoundersStory.module.css";

const timelineItems = [
  {
    date: "Housing & Homelessness",
    text: "Experiencing homelessness, shelter living, housing instability, and the exhausting work of rebuilding stability while learning systems that were never explained in a way that made sense during a crisis.",
  },
  {
    date: "Law Enforcement",
    text: "Living through a serious 2023 law-enforcement incident involving a vehicle pursuit and a 40mm projectile, then trying to understand the records, evidence, legal questions, and path forward without having a ready-made roadmap.",
  },
  {
    date: "Family & Trauma",
    text: "Supporting her family while her child's father experienced a traumatic brain injury and PTSD, dealing with significant changes in his behavior and personality, and managing her own PTSD while protecting a resilient young child.",
  },
  {
    date: "Race & Perspective",
    text: "Experiencing housing and public-system interactions differently while with her Hispanic partner, including a housing process that took about one week when she applied alone and approximately four months when applying with him, followed by a counselor telling her to look farther south where it was 'more cultural.' The experience forced her to confront race and systems from a perspective she had never personally experienced before.",
  },
  {
    date: "Kinship Care",
    text: "Entering the foster-care system as a kinship caregiver because a child needed someone, learning its terminology, paperwork, meetings, services, and expectations, and experiencing the emotional shock of feeling that the role had changed from trusted caregiver to person under suspicion.",
  },
  {
    date: "Records",
    text: "Learning that obtaining the records needed to understand a situation could itself become a major undertaking—finding the right agency, making requests, following up, reading large productions, comparing dates and statements, and preserving the underlying documents.",
  },
  {
    date: "The Turning Point",
    text: "Staring at an agency-posted flyer about a case she had been told did not exist. That contradiction changed the question from 'What am I being told?' to 'What does the underlying record actually show?'",
  },
  {
    date: "Decoded Justice",
    text: "Building the roadmap she wished she had: a place to tell the story, organize the record, preserve evidence, understand the system, identify questions, verify authorities, and prepare for the next step.",
  },
];

const setMetaTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "content") tag?.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }
  tag?.setAttribute("content", attributes.content);
};

const setLinkTag = (selector: string, attributes: Record<string, string>) => {
  let tag = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "href") tag?.setAttribute(key, value);
    });
    document.head.appendChild(tag);
  }
  tag?.setAttribute("href", attributes.href);
};

export default function FoundersStory() {
  useEffect(() => {
    const pageUrl = new URL("/founders-story", window.location.origin).toString();
    const absoluteOgImage = new URL(founderOgImage, window.location.origin).toString();

    document.title = "Founder's Story — Decoded Justice";

    setMetaTag('meta[name="description"]', {
      name: "description",
      content:
        "The lived experience behind Decoded Justice: housing instability, law enforcement, trauma, family, race, kinship care, records, and the decision to build a better roadmap.",
    });
    setMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: "Founder's Story — Decoded Justice",
    });
    setMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content:
        "The lived experience behind Decoded Justice—and why a clearer way to understand, organize, and document complex systems had to exist.",
    });
    setMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "article",
    });
    setMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: pageUrl,
    });
    setMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: absoluteOgImage,
    });
    setMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: "Founder's Story — Decoded Justice",
    });
    setMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content:
        "The lived experience behind Decoded Justice—and why a clearer way to understand, organize, and document complex systems had to exist.",
    });
    setMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: absoluteOgImage,
    });
    setLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: pageUrl,
    });
  }, []);

  return (
    <Layout>
      <article className={styles.storyPage}>
        <Masthead />

        <main className={styles.storyWrap}>
          <p className={styles.lede}>
            Decoded Justice was not born in a boardroom. It was built in the middle of a life that kept colliding with systems I had never been taught to navigate—and in the realization that I should not have had to become an accidental expert just to understand what was happening to my family.
          </p>

          <Section label="The Beginning" title="I Didn't Set Out to Build This." style={{ animationDelay: "0.15s" }}>
            <p className={styles.bodyParagraph}>
              I was trying to survive systems I didn't understand.
            </p>
            <p className={styles.bodyParagraph}>
              Over the years, I found myself navigating homelessness, shelters, housing instability, law enforcement, courts, public agencies, disability, and eventually the foster-care system.
            </p>
            <p className={styles.bodyParagraph}>
              I wasn't trained for any of it. I didn't have a legal degree. I didn't have a team of attorneys sitting beside me. I had questions, deadlines, records, fear, responsibility, and people I loved who depended on me.
            </p>
            <p className={styles.bodyParagraph}>
              What I needed was a roadmap.
            </p>
            <p className={styles.bodyParagraph}>
              Instead, I had to build one while I was already in the middle of the crisis.
            </p>
          </Section>

          <Section label="The Crisis Road" title="I Was Already on the Road." style={{ animationDelay: "0.18s" }}>
            <p className={styles.bodyParagraph}>
              You’re already on the road, in the middle of the crisis, and somehow you’re expected to build the roadmap while you’re still moving.
            </p>
            <p className={styles.bodyParagraph}>
              That was my experience. I had to figure out where I was, how I got there, what mattered, what records existed, and where I was supposed to go next—all while the situation was still unfolding.
            </p>
            <p className={styles.italicBlock}>
              I didn’t have a roadmap before the crisis. I had to build one while I was already on the road.
            </p>
            <p className={styles.bodyParagraph}>
              That became one of the reasons I built Decoded Justice.
            </p>
          </Section>

          <PullQuote
            quote="I didn't build Decoded Justice because I thought I knew the law. I started building it because I needed a way to understand what was happening to me."
            cite="— Founder, Decoded Justice"
          />

          <Section label="Housing" title="I Learned What It Means to Fight for Stability." style={{ animationDelay: "0.22s" }}>
            <p className={styles.bodyParagraph}>
              I experienced homelessness. I lived in shelters. I experienced the instability of losing housing and trying to rebuild a life.
            </p>
            <p className={styles.bodyParagraph}>
              Eventually, I found housing again. But I learned that getting stability and keeping stability can require completely different kinds of work.
            </p>
            <p className={styles.bodyParagraph}>
              Applications. Eligibility. Notices. Deadlines. Accommodation requests. Agency correspondence. Records. Follow-up.
            </p>
            <p className={styles.bodyParagraph}>
              I learned that when your housing is at stake, a misunderstanding is not small. A missing document, an unexplained delay, or a communication failure can become a crisis.
            </p>
            <p className={styles.bodyParagraph}>
              And I began to understand the first major lesson that would eventually become Decoded Justice:
            </p>
            <p className={styles.italicBlock}>
              Being told that a system has rules is not the same as being given a usable way to understand those rules.
            </p>
          </Section>

          <Section label="Law Enforcement" title="Then I Needed Answers About Something That Had Happened to Me." style={{ animationDelay: "0.29s" }}>
            <p className={styles.bodyParagraph}>
              In 2023, I experienced a serious law-enforcement incident involving a vehicle pursuit and a 40mm projectile.
            </p>
            <p className={styles.bodyParagraph}>
              Afterward, I needed to understand what had happened—not just emotionally, but through the record.
            </p>
            <p className={styles.bodyParagraph}>
              What records existed? What did the reports say? What did the underlying evidence show? Who made which decisions? What could be established? What still needed to be investigated?
            </p>
            <p className={styles.bodyParagraph}>
              I searched for an attorney. I searched for answers. I searched for someone who could help me understand what I was looking at.
            </p>
            <p className={styles.bodyParagraph}>
              And I learned how different it is to know that you need legal help from actually being able to obtain it.
            </p>
            <p className={styles.bodyParagraph}>
              So I began learning how to preserve and organize the information myself.
            </p>
          </Section>

          <Section label="Family & Trauma" title="I Was Also Trying to Hold My Family Together." style={{ animationDelay: "0.34s" }}>
            <p className={styles.bodyParagraph}>
              My child's father experienced a traumatic brain injury and PTSD. I experienced significant changes in his behavior and personality following his injuries, including increased anger and aggression.
            </p>
            <p className={styles.bodyParagraph}>
              I was dealing with my own PTSD at the same time.
            </p>
            <p className={styles.bodyParagraph}>
              I was trying to understand what was happening around me while protecting my child and keeping our lives functioning.
            </p>
            <p className={styles.bodyParagraph}>
              And through it all, my child showed resilience.
            </p>
            <p className={styles.bodyParagraph}>
              That resilience became part of what kept me moving.
            </p>
          </Section>

          <Section label="Race & Perspective" title="Then I Saw a System Through a Perspective I Had Never Experienced." style={{ animationDelay: "0.39s" }}>
            <p className={styles.bodyParagraph}>
              I am a white woman. For most of my life, I understood racism as something I knew existed and understood intellectually. I had not experienced the world from the perspective of being the person whose race might change how a system perceived or treated the people around me.
            </p>
            <p className={styles.bodyParagraph}>
              Then I was navigating housing with my Hispanic partner.
            </p>
            <p className={styles.bodyParagraph}>
              When I applied for housing on my own, I remember the process taking about one week. When I applied while seeking housing with my partner, it took approximately four months.
            </p>
            <p className={styles.bodyParagraph}>
              I could not see everything happening behind the application. I could not independently establish the reason for the difference from that experience alone. But the contrast was impossible for me to ignore.
            </p>
            <p className={styles.bodyParagraph}>
              Then my housing counselor told me to look farther south, where it was “more cultural.”
            </p>
            <p className={styles.bodyParagraph}>
              I knew immediately what she was saying, and the reality hit me like a ton of bricks.
            </p>
            <p className={styles.bodyParagraph}>
              My son was Hispanic. Suddenly, this was not only about something I had experienced. It was about the world my child was going to grow up in.
            </p>
            <p className={styles.bodyParagraph}>
              I could not promise him that he would never encounter discrimination. But I could refuse to let him grow up without the tools I had wished I had.
            </p>
            <p className={styles.italicBlock}>
              I will not allow my son to have to struggle through these systems alone if I can help it.
            </p>
          </Section>

          <PullQuote
            quote="You don't have to know the answer before you're allowed to investigate the question."
            cite="— A principle behind Decoded Justice"
          />

          <Section label="Kinship Care" title="Then I Entered the Foster-Care System." style={{ animationDelay: "0.44s" }}>
            <p className={styles.bodyParagraph}>
              I became a kinship caregiver because a child needed someone.
            </p>
            <p className={styles.bodyParagraph}>
              I learned the expectations, the paperwork, the meetings, the services, the terminology, and the responsibilities.
            </p>
            <p className={styles.bodyParagraph}>
              I tried to understand a system that was already complicated before adding trauma, family relationships, court proceedings, school issues, medical needs, agency involvement, and the fear of making a mistake.
            </p>
            <p className={styles.bodyParagraph}>
              And then, from my perspective, the way the system saw me changed almost instantly.
            </p>
            <p className={styles.bodyParagraph}>
              The person who had stepped forward to help could suddenly feel like the person under suspicion.
            </p>
            <p className={styles.bodyParagraph}>
              I can describe the emotional experience in only one way:
            </p>
            <p className={styles.italicBlock}>
              It felt like going from savior to predator in moments.
            </p>
            <p className={styles.bodyParagraph}>
              The hardest part was not only the fear. It was realizing how little I understood about the record being created around me while everything was happening.
            </p>
          </Section>

          <Section label="The Records" title="Then I Learned That Getting the Records Could Be Its Own Battle." style={{ animationDelay: "0.49s" }}>
            <p className={styles.bodyParagraph}>
              People say, “Get the records,” as though that is a simple instruction.
            </p>
            <p className={styles.bodyParagraph}>
              It isn't always.
            </p>
            <p className={styles.bodyParagraph}>
              I had to learn who might possess a record, what the record might be called, how to request it, which procedures applied, what could be withheld, how to follow up, and how to tell whether what I received was complete.
            </p>
            <p className={styles.bodyParagraph}>
              Then came the work of actually reading everything.
            </p>
            <p className={styles.bodyParagraph}>
              Hundreds of pages. Dates. Names. Emails. Notices. Reports. Policies. Court documents. Communications. Screenshots. Timelines.
            </p>
            <p className={styles.bodyParagraph}>
              I had to compare what I remembered with what was documented and compare one record with another.
            </p>
            <p className={styles.bodyParagraph}>
              I learned that memory tells you what you experienced. Records can show what happened inside a system. Sometimes they line up. Sometimes they don't. When they don't, the right response is not to invent an answer. It is to preserve the discrepancy and investigate it.
            </p>
          </Section>

          <Section label="What Can Get Buried" title="Corruption Exists. Sometimes It Is Buried." style={{ animationDelay: "0.52s" }}>
            <p className={styles.bodyParagraph}>
              I don't believe corruption is everywhere.
            </p>
            <p className={styles.bodyParagraph}>
              I don't walk into a system assuming everyone is lying or that every mistake has some hidden explanation. Sometimes people make mistakes. Sometimes records are incomplete. Sometimes communication breaks down. Sometimes there is an explanation you simply haven't found yet.
            </p>
            <p className={styles.bodyParagraph}>
              But corruption exists, too.
            </p>
            <p className={styles.bodyParagraph}>
              That is a reality of human systems. And it is not always brought forward.
            </p>
            <p className={styles.bodyParagraph}>
              Sometimes something serious can sit underneath an enormous amount of paperwork and workload without anyone stopping long enough to notice it.
            </p>
            <p className={styles.bodyParagraph}>
              Sometimes there is just one thing that doesn't make sense. Not something you went looking for. Not something you were trying to prove. Just something sitting there that you cannot, for the life of you, understand.
            </p>
            <p className={styles.bodyParagraph}>
              For me, that was the flyer.
            </p>
            <p className={styles.bodyParagraph}>
              They had posted it themselves. I had been told the case did not exist.
            </p>
            <p className={styles.italicBlock}>
              Yet there was the flyer.
            </p>
            <p className={styles.bodyParagraph}>
              I wasn't looking for corruption. I was trying to understand what was happening.
            </p>
            <p className={styles.bodyParagraph}>
              But that one thing would not fit.
            </p>
            <p className={styles.bodyParagraph}>
              And that taught me something I carry into everything I build with Decoded Justice: reality does not always arrive with an explanation attached to it.
            </p>
            <p className={styles.bodyParagraph}>
              Sometimes you have an answer. Sometimes you have a mistake. Sometimes you have a misunderstanding. Sometimes you have incomplete information. And sometimes, unfortunately, you may have something more serious.
            </p>
            <p className={styles.bodyParagraph}>
              The point is not to decide which one it is before you have the record. The point is to make it possible for a person to see what is actually there.
            </p>
          </Section>

          <Section label="The Moment" title="I Stared at a Flyer About a Case I Had Been Told Did Not Exist." style={{ animationDelay: "0.54s" }}>
            <p className={styles.bodyParagraph}>
              There is one moment I will never forget.
            </p>
            <p className={styles.bodyParagraph}>
              I was looking at a flyer they had posted themselves.
            </p>
            <p className={styles.bodyParagraph}>
              It concerned a case I had been told did not exist.
            </p>
            <p className={styles.bodyParagraph}>
              I stared at it and thought:
            </p>
            <p className={styles.italicBlock}>
              “Huh?”
            </p>
            <p className={styles.bodyParagraph}>
              I did not immediately know why the two things didn't match. But I knew there was a discrepancy.
            </p>
            <p className={styles.bodyParagraph}>
              That moment changed the question I asked.
            </p>
            <p className={styles.bodyParagraph}>
              I stopped asking only, “What am I being told?”
            </p>
            <p className={styles.bodyParagraph}>
              I started asking:
            </p>
            <p className={styles.italicBlock}>
              “What does the underlying record actually show?”
            </p>
            <p className={styles.bodyParagraph}>
              That question became foundational to Decoded Justice.
            </p>
          </Section>

          <Section label="The Realization" title="The System Was Confusing. Yet It Was the Only Way Forward." style={{ animationDelay: "0.59s" }}>
            <p className={styles.bodyParagraph}>
              The information existed.
            </p>
            <p className={styles.bodyParagraph}>
              The laws existed. The policies existed. The records existed. The procedures existed. The resources existed.
            </p>
            <p className={styles.bodyParagraph}>
              But they were scattered.
            </p>
            <p className={styles.bodyParagraph}>
              And people in crisis were expected to assemble the pieces themselves.
            </p>
            <p className={styles.bodyParagraph}>
              We are told to read the law, request the records, respond to the notice, file the appeal, document everything, and get an attorney.
            </p>
            <p className={styles.bodyParagraph}>
              But what if you don't know which law? Which record? Which deadline? Which agency? Which question? Which attorney?
            </p>
            <p className={styles.bodyParagraph}>
              What if you are already exhausted, traumatized, disabled, homeless, caring for children, or trying to keep your family together?
            </p>
            <p className={styles.bodyParagraph}>
              The most frightening realization was not that the systems were impossible.
            </p>
            <p className={styles.bodyParagraph}>
              It was that they could become navigable if you spent enormous amounts of time learning them—and that the difference between confusion and understanding could sometimes change what happened next.
            </p>
            <p className={styles.bodyParagraph}>
              There were moments when I wrote the right letter, found the right record, asked the right question, or organized the evidence in a way that changed the conversation. People were sometimes surprised that I had been able to do it.
            </p>
            <p className={styles.bodyParagraph}>
              I kept asking myself:
            </p>
            <p className={styles.italicBlock}>
              “What happens to the person who never figures it out?”
            </p>
          </Section>

          <PullQuote
            quote="I don't want people to have to become me just to understand their own lives."
            cite="— The reason Decoded Justice exists"
          />

          <Section label="The Platform" title="So I Built the Roadmap I Needed." style={{ animationDelay: "0.64s" }}>
            <p className={styles.bodyParagraph}>
              Decoded Justice began with a simple idea: start with the person's story, then build the record from there.
            </p>
            <p className={styles.bodyParagraph}>
              What happened?
            </p>
            <p className={styles.bodyParagraph}>
              When did it happen?
            </p>
            <p className={styles.bodyParagraph}>
              Who was involved?
            </p>
            <p className={styles.bodyParagraph}>
              What records exist?
            </p>
            <p className={styles.bodyParagraph}>
              What does each record actually say?
            </p>
            <p className={styles.bodyParagraph}>
              What is established? What is alleged? What is disputed? What is still unknown?
            </p>
            <p className={styles.bodyParagraph}>
              What authority should be checked?
            </p>
            <p className={styles.bodyParagraph}>
              What information is missing?
            </p>
            <p className={styles.bodyParagraph}>
              What needs to happen next?
            </p>
            <p className={styles.bodyParagraph}>
              The platform brings those pieces together through case organization, timelines, evidence and exhibits, issues, people and organizations, communications, records requests, legal education, guided analysis, and preparation tools.
            </p>
            <p className={styles.bodyParagraph}>
              It does not replace an attorney, a court, an agency, or an advocate. It does not decide who is right.
            </p>
            <p className={styles.bodyParagraph}>
              It helps people prepare the information they need to understand their situation and take their next step.
            </p>
          </Section>

          <Section label="The Philosophy" title="Don't Manufacture Certainty. Build the Record." style={{ animationDelay: "0.69s" }}>
            <p className={styles.bodyParagraph}>
              My experiences taught me something I want built into the foundation of Decoded Justice:
            </p>
            <p className={styles.bodyParagraph}>
              A contradiction is not automatically proof of misconduct.
            </p>
            <p className={styles.bodyParagraph}>
              An allegation is not automatically a fact.
            </p>
            <p className={styles.bodyParagraph}>
              A difficult experience is not automatically evidence of discrimination.
            </p>
            <p className={styles.bodyParagraph}>
              And a document does not become less important because someone says it means something different.
            </p>
            <p className={styles.bodyParagraph}>
              The answer is to build the record.
            </p>
            <p className={styles.bodyParagraph}>
              Preserve the source. Establish the date. Identify the speaker. Compare the documents. Separate what is known from what is claimed. Keep the unanswered questions visible until the evidence can answer them.
            </p>
            <p className={styles.bodyParagraph}>
              That discipline is not just a legal strategy. It is how I learned to keep my own story from being swallowed by the systems I was navigating.
            </p>
          </Section>

          <Section label="Why It Exists" title="I Don't Want the Next Person to Have to Learn This the Hard Way." style={{ animationDelay: "0.74s" }}>
            <p className={styles.bodyParagraph}>
              I became relentless because I had to.
            </p>
            <p className={styles.bodyParagraph}>
              I learned how to search because I had to. I learned how to read policies because I had to. I learned how to request records because I had to. I learned how to build timelines because I had to. I learned how to write those letters because I had to.
            </p>
            <p className={styles.bodyParagraph}>
              I don't want that to be the price of understanding your own life.
            </p>
            <p className={styles.bodyParagraph}>
              I don't want a parent in crisis to have to become an amateur case manager overnight. I don't want a tenant to have to become an expert in housing law just to understand a notice. I don't want someone dealing with law enforcement to have to reconstruct an event from scattered records without knowing where to start.
            </p>
            <p className={styles.bodyParagraph}>
              And I don't want my son—or anyone else's child—to grow up believing that they have to face these systems without a roadmap.
            </p>
            <p className={styles.bodyParagraph}>
              I cannot control every system my son will encounter. I cannot promise that he will never experience discrimination or injustice.
            </p>
            <p className={styles.bodyParagraph}>
              But I can build tools that make understanding and documenting those experiences less dependent on luck, money, or already knowing how the system works.
            </p>
          </Section>

          <Section label="The Person Behind It" title="This Is the Work I Wish Someone Had Done for Me." style={{ animationDelay: "0.79s" }}>
            <p className={styles.bodyParagraph}>
              Decoded Justice is deeply personal to me, but it is not meant to be a monument to my own experiences.
            </p>
            <p className={styles.bodyParagraph}>
              It is meant to turn what I learned the hard way into something useful for someone else.
            </p>
            <p className={styles.bodyParagraph}>
              I know what it feels like to stare at a document and not know what it means.
            </p>
            <p className={styles.bodyParagraph}>
              To wait for records.
            </p>
            <p className={styles.bodyParagraph}>
              To search for an attorney.
            </p>
            <p className={styles.bodyParagraph}>
              To wonder whether you missed something.
            </p>
            <p className={styles.bodyParagraph}>
              To be told to navigate a system when nobody has shown you how.
            </p>
            <p className={styles.bodyParagraph}>
              I also know what it feels like to finally find the record, write the letter, connect the timeline, understand the rule, and see a path forward.
            </p>
            <p className={styles.bodyParagraph}>
              That feeling is what I want Decoded Justice to give people:
            </p>
            <p className={styles.italicBlock}>
              Not the promise that the system will be fair—but the tools to understand the system, document what happened, and know what to do next.
            </p>
          </Section>

          <Closing style={{ animationDelay: "0.84s" }} />
        </main>
      </article>
    </Layout>
  );
}
