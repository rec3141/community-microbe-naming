# The user's earlier draft: "Data Ownership Matrix" (Google Sheet)

Source: the project team's "Data Ownership Matrix" Google Sheet (link kept private) (the user's own working draft, read 2026-10-29).
The user says this matrix is only a starting point; it need not keep this shape. The dossier may restructure it freely (different roles, data types, questions, format) as long as it keeps the core idea: an explicit who-decides-what for each kind of data.

Four tabs. Roles (columns): **Participants**, **HTO** (Hunters and Trappers Organization, Chesterfield Inlet), **UManitoba** (the research group),
**Public databases/archives** (for TK: "Databases/archives (SIKU)"), **Third party users**.
Rows are grouped under Possession / Accountability / Execution / Production.

## Tab 1: Natural Science data
Raw: weather, GPS position, temperature, salinity, nutrients, oxygen, organic matter, hydrocarbons, microbial abundance, **microbial DNA sequences**, photos without people.
Analyzed: maps, charts, graphs, summaries, tables, statistics.
Roles: HTO | UManitoba | Public DBs | Third party. Draft answers (X = yes):
- Collecting samples: HTO, UM
- Generating raw data: UM, third party (e.g. sequencing facility)
- Producing analyzed data: UM
- Controls access permissions, raw AND analyzed: **HTO only**
- Versioning: UM
- Consuming / accessing / storing raw & analyzed: all four
- Can publish: HTO, UM, third party
- Decides goal: HTO, UM; understands goal: HTO, UM
- Verifies integrity, responsible for loss, liable for corruption, fixes problems: UM
- Licensing agreements: **HTO**
- Decides what to collect: HTO, UM; controls which roles/orgs access: **HTO**; add/change/remove: HTO, UM
- Benefits: HTO, UM, third party; **IP derived from data: HTO**
(Tension to flag: public DB / third parties have open access in the draft while HTO "controls access", which is the INSDC/SeqCode open-deposition question.)

## Tab 2: Traditional Knowledge data (definition left blank)
Roles: Participants | HTO | UM | Databases/archives (SIKU) | Third party.
- Generating data: Participants, HTO; controls access: Participants, HTO
- Updating: UM; consuming/accessing/storing: HTO, UM, SIKU
- Publish: HTO, UM; decides goal: HTO, UM; verifies integrity: HTO
- Loss/corruption/fixes: UM; licensing: HTO; decides what to collect: HTO, UM; controls access roles: HTO
- Benefits: Participants, HTO, UM; **IP: Participants**

## Tab 3: Social Science data (audio/video/photos of people)
Same questions, **all answers blank**: still to be filled in.

## Tab 4: Data Model Questions
A generic data-modelling checklist (partly borrowed from software/DDD language, e.g. "bounded context", "DVS", "PaaS"):
needs/goals, reporting requirements, kinds of data, public / private / semi-private, when created/updated/accessed,
where stored/used, how versioned, who is the audience, who owns/possesses, who depends on it, why collected.
The software-specific rows need translating into plain language for a community audience.
