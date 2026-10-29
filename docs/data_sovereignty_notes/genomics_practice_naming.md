# Indigenous data sovereignty in genomic, microbiome and eDNA research: repositories, Labels, and Indigenous-language naming of microbes

Researched 2026-10-29. About 20 tool calls, so coverage is broad but not exhaustive. Items marked **[UNVERIFIED]** come from background knowledge and were not confirmed against a primary source in this session. Verify them before putting them on a slide.

## 1. Local Contexts (TK/BC Labels and Notices): how they attach to NCBI, ENA, GBIF and GenBank records

### Takeaway
Local Contexts Labels and Notices are live and machine-readable. Each Hub project has a persistent ID, and the Labels are referenced through the Hub API. GBIF has a pilot integration and the Aotearoa Genomic Data Repository is a certified integration partner (May 2026). I found **no evidence that NCBI, ENA or DDBJ (the INSDC) has a dedicated Local Contexts field or displays Labels** as of Oct 2026. In practice researchers put the Hub project URL into a free-text or custom attribute and into the paper's data-availability statement.

### Cited Findings
- **The two types.** TK Labels define attribution, access and use expectations for Indigenous cultural heritage. BC (Biocultural) Labels define community expectations and consent for collections and data, and they extend the TK initiative to genetic resources and genomic data — [Local Contexts, About the Labels](https://localcontexts.org/labels/about-the-labels/); [BC Labels](https://localcontexts.org/labels/biocultural-labels/)
- **Who applies what.** Only an Indigenous community can apply a BC Label. Notices are researcher- or institution-facing icons that signal Indigenous provenance — [Liggins, Hudson & Anderson 2021, Mol Ecol, doi:10.1111/mec.15918](https://onlinelibrary.wiley.com/doi/10.1111/mec.15918); [Biocultural Labels Initiative, Zenodo](https://zenodo.org/records/4097637)
- **Notices can be applied at any stage.** That includes data already published and deposited in public repositories, which makes them usable as an interim step before a community has set its own Labels — [Liggins et al. 2021](https://onlinelibrary.wiley.com/doi/10.1111/mec.15918)
- **BC Provenance Label template.** The template text says "[Community name or authorizing party] retains the right to be named and associated with it into the future" — [Local Contexts, BC Provenance](https://localcontexts.org/label/bc-provenance/)
- **Hub mechanics.** Each Local Contexts Hub project has a 36-character project ID. The API uses it to fetch the project's Labels and Notices, so a repository record only needs to carry the project ID or URL and the Labels update automatically when the community changes them — [Local Contexts Projects (PDF)](https://localcontexts.org/wp-content/uploads/2023/08/Local-Contexts-Projects.pdf)
- **DataCite pattern (the most formalized field mapping found).** Labels and Notices go in the `rights` element with `rightsIdentifierScheme="Local Contexts"`, a `rightsIdentifier` such as "TK-Notice", and a URI that points to the Hub project — [DataCite support: Local Contexts Notices and Labels](https://support.datacite.org/docs/local-contexts-notices-and-labels). This is relevant for any Zenodo, Dataverse or FRDR DOI minted for MAG bins and metadata.
- **GBIF (pilot).** GBIF plans to pull Local Contexts identifiers and URLs through the Local Contexts API. It would show them on dataset and occurrence pages and include them in the API and in downloads. The pilot asks publishers to enrich datasets with identifiers for Notices, Labels and Projects. The technical docs give no dates and do not say whether this is live — [GBIF techdocs: Local Contexts integration](https://techdocs.gbif.org/en/data-publishing/local-contexts-integration); [GBIF Local Contexts pilot](https://techdocs.gbif.org/en/data-publishing/local-contexts-pilot). A search summary said the Darwin Core term `dynamicProperties` is proposed as a temporary carrier. I did not confirm that on the fetched page.
- **ERGA (European Reference Genome Atlas).** ERGA guidance lets members place a Notice on samples, data or both through the sample metadata manifest, mapped to the existing Darwin Core rights field. ERGA partnered with Local Contexts to carry Notices across repositories that use different metadata brokers. ERGA data goes to ENA, so this is the closest existing route to ENA — [ERGA TK/BC Labels guidance (Zenodo 8088227)](https://zenodo.org/records/8088227/files/Guidance%20Documentation%20for%20Implementing%20the%20Traditional%20Knowledge%20and%20Biocultural%20Labels%20in%20the%20European%20Reference%20Genome%20Atlas.pdf); [ENRICH Policy Brief 2024](https://zenodo.org/records/13172148/files/ENRICH%20Policy%20Brief%20%202024.pdf)
- **MIxS / GSC.** A `biocultural_label` term is *proposed* in the MIxS-MInAS ancient-DNA extension, as a GitHub issue rather than adopted standard — [MIxS-MInAS issue #48](https://github.com/MIxS-MInAS/extension-ancient/issues/48). The Biocultural Labels Initiative says it is working toward metadata fields in GSC and TDWG standards — [Zenodo 4097637](https://zenodo.org/records/4097637)
- **Why the Labels were built.** Traditional knowledge is not held in genomic databases like NCBI. BC Labels were developed as a practical way to connect provenance information to digital sequence information (DSI) submitted to those databases — [Frontiers in Genetics 2022, doi:10.3389/fgene.2022.1014044](https://www.frontiersin.org/journals/genetics/articles/10.3389/fgene.2022.1014044/xml/nlm)
- **NCBI BioSample attributes.** These are name:value pairs. NCBI encourages its attribute dictionaries but also accepts custom attributes the submitter chooses — [Barrett et al. 2012, NAR, BioProject/BioSample](https://academic.oup.com/nar/article/40/D1/D57/2903284); [BioSample docs](https://www.ncbi.nlm.nih.gov/biosample/docs/). A custom attribute such as `local_contexts_project = https://localcontextshub.org/projects/<id>` should therefore be accepted. That is an inference; I found no NCBI documentation of an official field.
- **eDNA precedent.** The ENRICH 2024 policy brief describes a Maine eDNA project that used the "Open to Collaborate" Notice — [ENRICH Policy Brief 2024](https://zenodo.org/records/13172148/files/ENRICH%20Policy%20Brief%20%202024.pdf). A related brief is "Recognizing Indigenous Interests: Labeling DSI with Provenance Metadata" — [Zenodo 13308162](https://zenodo.org/records/13308162)
- **Ocean Networks Canada.** ONC is reported to be integrating Labels into its metadata profiles. This was reported in a search summary only and is **[UNVERIFIED]** in detail. It is relevant because ONC operates Arctic observatories, including at Cambridge Bay.

### Inferences
- **Practical recipe for Igluligaarjuk:**
  1. Create a Local Contexts Hub project, by the researcher or institution, and apply the BC Provenance Notice and/or the Open to Collaborate Notice now.
  2. Invite the community, for example the Sapujiyiit Society or the Hamlet or HTO, to apply BC or TK Labels when it chooses.
  3. Put the Hub project URL in the BioProject description, a custom BioSample attribute, the GenBank/WGS comment, any DOI's `rights` field, the paper's data-availability statement and the SeqCode protologue.
- Because Labels are fetched live by project ID, the community can change them after deposition even though the sequence itself stays public.
- Labels signal expectations; they **do not enforce access control** on INSDC records. Present them as a provenance and relationship tool, not as a lock.

### Gaps
- I found no NCBI or ENA documentation, announcement or field name for Local Contexts as of Oct 2026. Check NCBI's BioProject submission guide and the ENA checklist ERC000011 for any "Indigenous provenance" field directly.
- I found no specific journal or funder that *mandates* Labels. Some journals and funders (for example, Genomics Aotearoa–funded work) encourage them **[UNVERIFIED]**.
- I found no published microbial MAG or SeqCode name record that carries a Local Contexts Label.

## 2. Data-access models and compatibility with SeqCode

### Takeaway
SeqCode valid publication requires the type genome to be **publicly available in INSDC**. Controlled-access repositories such as the AGDR, NativeBio or dbGaP-style models **cannot host the type genome of a SeqCode name**. They can hold the raw reads, other MAGs, fine-scale metadata and physical samples. The SeqCode text (v1.2.0, dated 12 Aug 2026 per the Registry page) has no provisions on embargo, controlled access, Indigenous data or data sovereignty. Compatible levers are: a hold-until-publication release date, depositing only the type MAG assembly while keeping other data local, coarse-graining coordinates, and Labels/Notices.

### Cited Findings
- **SeqCode rules.** Rule 18a: "The sequence must be available in the International Nucleotide Sequence Database Collaboration (INSDC)." Rule 26 makes valid publication depend on registration in the SeqCode Registry with the mandatory fields, a clearly designated type, and "the type sequence is deposited according to Rule 18a and the accession number cited." Etymology is a required field, and "Roots can originate from any language in use or extinct." Principle 3 says names are Latin or Latinized. Rec. 9(3) says "Languages other than Latin should be avoided when Latin equivalents exist." Rec. 9(6) says names "should not be deliberately contentious or abusive of any person." The Code text contains no mention of embargo, controlled access, Indigenous, cultural or data-sovereignty matters — [SeqCode text, Registry (version reported as 1.2.0, 12 Aug 2026)](https://registry.seqco.de/page/seqcode)
- **Registry quality check.** The check flags a type sequence not available in INSDC as a contravention of Rules 18a and 26.3 ("Unrecognized type material") — [example Registry record](https://registry.seqco.de/seqcode/names/25894)
- **Secondary-source requirements.** A review says the Registry requires the type genome assembly in INSDC *and* the raw reads in SRA, plus completeness and contamination thresholds. This is from a secondary source; check the current Registry minimum standards before relying on it — [SeqCode in the golden age of prokaryotic systematics, ISME J 2024, wrae109](https://academic.oup.com/ismej/article/18/1/wrae109/7696152); [Why and how to use the SeqCode (PMC11139209)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11139209/). The same search summary listed raw-data access as a *recommendation* (Appendix I), not a rule. **The sources conflict on whether SRA reads are mandatory. Resolve this on registry.seqco.de before advising the community that reads can be withheld.**
- **Founding paper.** Hedlund, Chuvochina, Hugenholtz, Konstantinidis, Murray, Palmer, Parks, Probst, Reysenbach, Rodriguez-R, Rossello-Mora, Sutcliffe, Venter & Whitman 2022, "SeqCode: a nomenclatural code for prokaryotes described from sequence data", *Nature Microbiology* 7:1702–1708 — [doi:10.1038/s41564-022-01214-9](https://www.nature.com/articles/s41564-022-01214-9); [PMC9519449](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9519449/). The task brief's "Whitman et al. 2022" is probably this paper (Whitman is last author) **[author list from memory, UNVERIFIED]**. I found no statement in it about Indigenous names or data sovereignty.
- **Aotearoa Genomic Data Repository (AGDR).** Built on CARE + FAIR, developed by Genomics Aotearoa and NeSI, funded by MBIE, hosted in Aotearoa by REANNZ. Access requests are assessed by the kaitiaki of each dataset. It became the **second certified Local Contexts Integration Partner** (Local Contexts post dated 13 May 2026) and shows Labels and Notices alongside the data — [Local Contexts announcement](https://localcontexts.org/aotearoa-genomic-data-repository-joins-local-contexts-as-one-of-our-first-certified-integration-partners/); [Te Aika et al. 2025, "Aotearoa genomic data repository: An āhuru mōwai for taonga species sequencing data", Mol Ecol Resour, doi:10.1111/1755-0998.13866](https://onlinelibrary.wiley.com/doi/10.1111/1755-0998.13866)
- **Critique of open deposition.** Dhami et al. 2025 argue that DNA from many taonga species has been uploaded to public repositories with no restrictions, and that DNA from taonga species is itself taonga and subject to tikanga — [doi:10.1111/1755-0998.70021](https://onlinelibrary.wiley.com/doi/10.1111/1755-0998.70021)
- **Native BioData Consortium (NativeBio).** A nonprofit founded in 2018 in Eagle Butte, SD, on the Cheyenne River Sioux Reservation. It holds biospecimens and data under tribal regulation and jurisdiction, with a tribal community advisory board. It is the archive for the NIH-funded Tribal Data Repository (Stanford-led, about $9M). It is building a soil microbiome map of Native lands and keeps sequencing local — [nativebio.org/about-us](https://nativebio.org/about-us); [NativeBio fact sheet (Nov 2025)](https://www.nativebio.org/sites/default/files/2025-11/native-biodata-consortium-fact-sheet.pdf); [Illumina feature](https://www.illumina.com/company/news-center/feature-articles/how-indigenous-scientists-are-taking-control-of-their-data.html); [UCSC news on RADx tribal repository](https://news.ucsc.edu/2023/12/radx-grant/)
- **Rationale for controlled access.** Hudson et al. 2020, "Rights, interests and expectations: Indigenous perspectives on unrestricted access to genomic data", *Nat Rev Genet* 21:377–384, doi:10.1038/s41576-020-0228-x **[UNVERIFIED this session]**.

### Inferences
- **Not compatible with a SeqCode name:** putting the type MAG only in a controlled-access or community repository, or keeping it permanently embargoed. In either case the name cannot be validly published.
- **Compatible:**
  - NCBI/ENA hold-until-publication release dates. The type genome must be public before or at registration and validation. NCBI's maximum hold is reportedly up to 4 years **[UNVERIFIED]**.
  - Depositing only the specific type MAG assemblies while keeping the remaining bins, raw reads and fine metadata under community governance. This holds only if SRA reads turn out not to be mandatory; see the conflict above.
  - Coarse-graining `lat_lon`, for example to the inlet or region rather than the exact site. MIxS/INSDC missing-value terms such as "missing: restricted access" are reportedly allowed **[UNVERIFIED]**.
  - Labels/Notices attached by Hub URL.
  - Withholding physical samples and extracts.
- **Low-risk content for the type sequence:** a marine water-column MAG of a free-living bacterium carries no human genetic data. The main sensitivities are site location, potential bioprospecting/DSI value, and narrative ownership of the name. Say this explicitly so the trade-off is honest.
- **Nagoya and DSI:** the multilateral DSI benefit-sharing "Cali Fund" under the CBD (2024) is relevant to the bioprospecting concern. Canada is not a party to the Nagoya Protocol **[UNVERIFIED this session]**.

### Gaps
- I could not confirm whether the SeqCode Registry lets a name sit privately registered (unpublished) while the INSDC record is on hold. My recollection is that registration lists are private until submitted for validation **[UNVERIFIED]**.
- I found no SeqCode committee statement (2023–2026) on Indigenous names or data sovereignty. Check the SeqCode committee minutes or ballots at seqco.de.
- I did not verify ICNP (Prokaryotic Code 2022 revision) provisions for this question.

## 3. Indigenous-language and community-chosen names for microbes and other taxa

### Takeaway
**I found no validly published (SeqCode or ICNP) prokaryote name chosen by an Inuit community in Inuktitut.** The closest precedent is ***Candidatus* Tariuqbacter** / class **Tariuqbacteria** (Vigneron, Vincent & Lovejoy 2023), named by researchers from Inuktitut *tariuq* ("saltwater") for a MAG from Lake A, Ellesmere Island. That was a researcher-chosen Candidatus name, made in consultation with Inuk Elder Larry Audlaluk of Grise Fiord (see the update at the end of this file). Igluligaarjuk appears to be a first-of-its-kind *community-chosen* Inuktitut naming under the SeqCode. The taxonomy literature is actively debating eponyms and Indigenous names, mostly for plants and animals.

### Cited Findings
- **Tariuqbacteria.** Vigneron A, Vincent WF, Lovejoy C. 2023. "Discovery of a novel bacterial class with the capacity to drive sulfur cycling and microbiome structure in a paleo-ocean analog." *ISME Communications* 3:82. The study is from Lake A, Ellesmere Island (Canadian High Arctic), and proposes class Tariuqbacteria and the *Candidatus* Tariuqbacter genome. According to PubMed: [doi:10.1038/s43705-023-00287-9](https://doi.org/10.1038/s43705-023-00287-9) (PMID 37596370). The etymology ("Tariuq" = saltwater in Inuktitut) comes from a search summary; I did not read it on the article page. The acknowledgements confirm consultation (see the update at the end); I found no evidence of SeqCode registration **[UNVERIFIED]**.
- **Igluligaarjuk / Genice II.** Nunatsiaq News (Daron Letts, 7 Sep 2026) reports that the University of Manitoba Centre for Observation Science runs Genice II (since 2022) with the Sapujiyiit Society of Inuit knowledge-keepers in Chesterfield Inlet. Field technician Simon Aggark collects under-ice samples. Nicole Wilson said "Inuit of all ages will be invited to propose Inuktitut names" in October 2026 — [Nunatsiaq News](https://nunatsiaq.com/stories/article/researchers-study-oil-eating-microbes-off-hudson-bay-coast/). The template repository says the names follow SeqCode rules — [GitHub rec3141/community-microbe-naming](https://github.com/rec3141/community-microbe-naming). This is the project's own material, so it is not independent evidence of precedent.
- **Hawaiian precedent (common name only).** *Flavobacterium akiainvivens* has a Hawaiian common name, *koʻohonua ʻili akia* ("ʻākia bark bacteria"). The Latin binomial is not in Hawaiian — [Wikipedia](https://en.wikipedia.org/wiki/Flavobacterium_akiainvivens). This is a tertiary source; verify against the protologue (IJSEM, Kuo et al. 2013 **[UNVERIFIED]**). The idea of a parallel Indigenous-language common name alongside the Latinized name is a useful model.
- **Māori names in taxonomy (non-microbial).** Strategies for using te reo Māori in species names vary, and some practices do not follow Linnaean rules — ["The use of the Māori language in species nomenclature", ScienceDirect, S2212682113000383](https://www.sciencedirect.com/science/article/pii/S2212682113000383). Te reo and botanical nomenclature are framed as complementary systems, and the authors call for guidelines on scientist–iwi dialogue — ["Te reo Māori and botanical nomenclature as complementary naming systems for New Zealand's flora" (2021)](https://www.researchgate.net/publication/348394268_Te_reo_Maori_and_botanical_nomenclature_as_complementary_naming_systems_for_New_Zealand's_flora)
- **Gillman & Wright 2020.** "Restoring indigenous names in taxonomy", *Communications Biology* 3:609. They propose that Indigenous names replace the species epithet where there is consensus on a single Indigenous name across the taxon's range and demonstrable temporal priority. A reply notes that widely distributed taxa with many Indigenous names would stay unchanged — cited via [Guedes et al. 2023](https://www.nature.com/articles/s41559-023-02022-y.pdf) and a search summary. Title and DOI (10.1038/s42003-020-01344-y) **[UNVERIFIED]**.
- **Guedes et al. 2023.** "Eponyms have no place in 21st-century biological nomenclature", *Nat Ecol Evol* 7:1157–1160. They argue that eponyms are out of step with equality and propose descriptive or locally meaningful names — [doi:10.1038/s41559-023-02022-y](https://www.nature.com/articles/s41559-023-02022-y.pdf); [Mongabay coverage, Jul 2023](https://news.mongabay.com/2023/07/should-species-be-named-after-people-its-up-for-debate)
- **Responses.** Orr et al. 2023 (Correspondence, *Nat Ecol Evol*) argue that eponyms can empower. They propose making species-description funding contingent on including local researchers and on prioritizing local names — [Orr et al. 2023 PDF](https://ymilesz.github.io/Pubs/Orr%20et%20al%202023%20-%20Species%20Naming.pdf). Jost et al. published a rebuttal defending eponyms (not verified from the primary source) — [WEIT blog](https://whyevolutionistrue.com/2023/10/12/an-online-debate-about-naming-species-after-people/). Lee et al. 2025/2026 in *BioScience* give an Asian perspective on changing unethical names; I saw only the title — [PDF](https://ymilesz.github.io/Pubs/Lee%20et%20al%202026%20-%20Rethinking%20Changing%20Unethical%20Names%20in%20Taxonomy%20An%20Asian%20Perspective.pdf)
- **Governance positions.** The ICZN president is quoted: "It's not our mandate to regulate anything based on ethics" — [Mongabay](https://news.mongabay.com/2023/07/should-species-be-named-after-people-its-up-for-debate). The botanical Code (Madrid, IBC 2024; 2025 edition) adopted, by 60% supermajority, a mechanism to reject names derogatory to groups of people, applying only to names published after a cutoff date (search summary; see the [Madrid Code](https://www.summerfieldbooks.com/?p=844411)). **I found no 2025 ICZN amendment on Indigenous names.**
- **Mammola et al.** This item from the brief was not retrieved. I believe it is a 2023 paper on the ethics and naming of species or eponym data **[UNVERIFIED, not found]**.

### Inferences
- **How to credit the community in the protologue** (a suggested practice, not a codified precedent):
  - Give the etymology field the Inuktitut word in syllabics and roman orthography, its meaning, and the dialect (Kivalliq).
  - Add a statement such as "name proposed by participants of the Igluligaarjuk community naming workshop, October 2026, in partnership with the Sapujiyiit Society", with the names of individuals who consent.
  - Include the Local Contexts Hub project URL.
  - Consider co-authorship of the name for community members. Under SeqCode the name's authority is the authors of the effective publication, so community co-authors become part of the authority citation **[inference]**.
- Because Rec. 9(3) discourages non-Latin roots where Latin equivalents exist, the protologue should state the cultural reason for the Inuktitut roots. It is a recommendation, not a rule, and Rule 26 explicitly allows roots from any language.
- A parallel Inuktitut common name in syllabics (the Hawaiian *akiainvivens* model) can carry meaning that does not survive Latinization.

### Gaps
- I found no verified Aboriginal Australian, Māori or Sámi Latin binomial for a prokaryote, and no Greenlandic (Kalaallisut) one. Absence here is not proof of absence; the LPSN etymology search was not done.
- I did not find whether the SeqCode Registry has accepted any name with community-proposer credit.

## 4. Case studies: community-partnered microbiome and eDNA research with Indigenous communities

### Takeaway
The Indigenous microbiome-ethics literature is mostly human-gut focused (Hadza, Yanomami, Native American). Key frameworks appeared in *Nature Microbiology* in 2022–2023. Environmental and taonga-species precedents come mainly from Aotearoa (the AGDR and the Ngātiwai tuatara genome). Inuit microbiome studies exist (Nunavik gut and oropharynx) but are human-health studies. I found no published Inuit-led environmental-MAG sovereignty case.

### Cited Findings
- **Relational framework (2023).** "A relational framework for microbiome research with Indigenous communities", *Nature Microbiology* 2023. It centres relationality among Indigenous peoples, researchers and microbes, and accountability to flatten power imbalances — [doi:10.1038/s41564-023-01471-2](https://www.nature.com/articles/s41564-023-01471-2); [PubMed 37770743](https://pubmed.ncbi.nlm.nih.gov/37770743/); [UH news, Nov 2023](https://www.hawaii.edu/news/2023/11/15/inclusive-microbiome-research/). Author list not retrieved.
- **Mangola et al. 2022.** "Ethical microbiome research with Indigenous communities", *Nature Microbiology*. Lead author Stephanie Mangola is a Hadzabe activist and community leader. The paper urges inclusion from the outset and profit sharing — [ResearchGate](https://www.researchgate.net/publication/360646024_Ethical_microbiome_research_with_Indigenous_communities). DOI not verified (likely 10.1038/s41564-022-01116-w **[UNVERIFIED]**).
- **"Microbiome ownership for Indigenous peoples"** (2023; journal probably *Nat Microbiol* **[UNVERIFIED]**). It argues that data-sovereignty principles apply to the microbiome field, and notes that the field has lacked direct engagement with Indigenous data sovereignty — [ResearchGate](https://www.researchgate.net/publication/374284345_Microbiome_ownership_for_Indigenous_peoples)
- **Scoping review on benefit sharing.** A review on commercialization of Indigenous biospecimens covers biocolonialism, sovereignty and benefit sharing — [ResearchGate](https://www.researchgate.net/publication/304374961_Ethics_of_exploring_the_microbiome_of_native_peoples). Title and authors only partly verified.
- **Tsosie et al. 2021.** "We have 'gifted' enough: Indigenous genomic data sovereignty in precision medicine", *Am J Bioethics* — cited in search results; DOI **[UNVERIFIED]**
- **Ngātiwai and tuatara.** Ngātiwai hold kaitiakitanga over tuatara populations, and the genome project ran under their guardianship — [Science Media Centre NZ, Aug 2020](https://www.sciencemediacentre.co.nz/2020/08/06/genomic-research-and-indigenous-data-sovereignty-expert-reaction/)
- **Inuit microbiome studies (human-associated, Nunavik/Nunavut):**
  - Gut metagenome of Nunavik Inuit youth — [Commun Biol 2022, s42003-022-04372-y](https://www.nature.com/articles/s42003-022-04372-y)
  - Oropharyngeal microbiome in Nunavik Inuit — [Sci Rep 2023, s41598-023-43821-4](https://www.nature.com/articles/s41598-023-43821-4)
  - Culturomics of Inuit oropharyngeal microbiota (bioRxiv, Apr 2026, describes new species; its naming practice and community naming are unknown) — [bioRxiv 2026.04.20.719640](https://www.biorxiv.org/content/10.64898/2026.04.20.719640v1)
  - Nunavut stool study, 2017 — [ScienceDaily](https://www.sciencedaily.com/releases/2017/01/170110151357.htm)
- **Arctic Indigenous context in the same water body.** The Genice II partnership with the Sapujiyiit Society combines Inuit Qaujimajatuqangit with microbiology — [Nunatsiaq News, 7 Sep 2026](https://nunatsiaq.com/stories/article/researchers-study-oil-eating-microbes-off-hudson-bay-coast/)

### Inferences
- The Yanomami case (antibiotic-resistance gut microbiome, Clemente et al. 2015 *Sci Adv* **[UNVERIFIED]**) and Hadza critiques are best used as cautionary tales about extraction. For environmental MAGs, the more relevant frame is taonga species (Aotearoa) rather than human-subjects research.
- Nunavut research licensing (Nunavut Research Institute; Nunavut Impact Review Board where applicable) and ITK's National Inuit Strategy on Research (2018) are the governing Inuit-specific frameworks **[not retrieved this session; UNVERIFIED details]**. Cite them from the companion dossier if covered there.

### Gaps
- I found no published Inuit-led eDNA or MAG project with a documented data agreement or Labels. I did not search for Arctic char community genomics or Ikaarvik.
- I did not search for Sankaranarayanan et al. or Abdill et al.; their relevance is unconfirmed.

## 5. Benefit sharing in practice, and sample governance

### Takeaway
The usable toolkit is:
- **CARE principles** (Collective benefit, Authority to control, Responsibility, Ethics) alongside FAIR
- **Local Contexts Notices and Labels**
- **ENRICH** (Equity for Indigenous Research and Innovation Coordinating Hub) policy briefs
- **Indigenous-governed repositories** (the AGDR, NativeBio)
- **co-authorship and naming credit**
- **community-held physical samples**

Concrete Canadian DMP templates for Indigenous data were not retrieved this session.

### Cited Findings
- **ENRICH policy briefs (2024).** These cover Labels as provenance metadata for DSI in CBD discussions — [ENRICH Policy Brief 2024](https://zenodo.org/records/13172148/files/ENRICH%20Policy%20Brief%20%202024.pdf); [Labeling DSI with Provenance Metadata](https://zenodo.org/records/13308162)
- **Global standard on Indigenous Peoples' data.** NNI (University of Arizona), NYU and Harvard are leading a process to codify a global standard on Indigenous Peoples' data — [NNI news](https://nni.arizona.edu/news/u-nyu-and-harvard-experts-lead-process-codify-worlds-first-global-standard-indigenous-peoples)
- **Canadian Local Contexts guide.** CAN-PEAT (University of Waterloo) has a Local Contexts FAQ guide — [PDF](https://uwaterloo.ca/can-peat/sites/default/files/uploads/documents/can-peat-local-contexts-guide-part-1-frequently-asked-questions-faq.pdf)
- **Keeping samples and data local.** NativeBio runs a biospecimen repository under tribal jurisdiction and uses local sequencing to keep samples and data in the community — [NativeBio](https://nativebio.org/about-us). The AGDR hosts data in-country with kaitiaki approving access — [Local Contexts announcement](https://localcontexts.org/aotearoa-genomic-data-repository-joins-local-contexts-as-one-of-our-first-certified-integration-partners/)
- **CARE principles.** Carroll et al. 2020, "The CARE Principles for Indigenous Data Governance", *Data Science Journal* 19:43, doi:10.5334/dsj-2020-043 **[UNVERIFIED this session]**
- **OCAP.** OCAP® (First Nations Information Governance Centre) applies to First Nations. Inuit-specific guidance comes from ITK (National Inuit Strategy on Research, 2018) and the Nunavut Research Institute **[UNVERIFIED this session]**.
- **Digital Research Alliance of Canada.** The Alliance (formerly Portage) has DMP guidance for research with Indigenous communities **[not retrieved; UNVERIFIED]**.

### Inferences
- **Concrete benefit items for the Igluligaarjuk workshop:**
  - naming credit in the protologue
  - community co-authorship
  - a Hub project with Notices applied immediately and Labels open to the community
  - a plain-language Inuktitut and English summary
  - return of data (MAG summaries, posters and handouts)
  - local training (sampling and Nanopore)
  - a written agreement covering what goes public (type MAGs only), what is held back (precise coordinates, other bins, reads if allowed), and what happens to physical samples
- **Physical samples and extracts are the strongest lever for sovereignty**, because the SeqCode requires only *sequence* deposition, not culture deposition. The agreement can specify whether DNA extracts are stored in the community or at the University of Manitoba, whether they are repatriated, and that they will be destroyed on request. It should also say plainly that **sequence already released to INSDC cannot be recalled** from mirrors, so destruction applies to physical material and unpublished data only.

### Gaps
- I did not retrieve templates for community research or data agreements (for example, Nunavut licence conditions, FNIGC/ITK templates, or Genomics Aotearoa's Te Nohonga Kaitiaki guidelines).
- I did not retrieve documented repatriation or destruction-request precedents for environmental DNA extracts.
- I found no evidence of a journal or funder in Canada (NSERC, SSHRC or CIHR tri-agency) mandating Local Contexts. The Tri-Agency Research Data Management Policy says Indigenous-generated data should be managed per community-defined principles **[UNVERIFIED this session]**.

## Update from the user (2026-10-29): Tariuqbacter consultation confirmed
The user checked the paper (Vigneron, Vincent & Lovejoy 2023, *ISME Communications* 3:82, doi:10.1038/s43705-023-00287-9). Its Acknowledgements read:
"We express our thanks to Larry Audlaluk for discussions in Grise Fiord about this work and the naming in Inuktitut."
So *Ca.* Tariuqbacter / Tariuqbacteria is a real precedent for an Inuktitut-rooted prokaryote name, made with consultation of an Inuk Elder from Grise Fiord (Aujuittuq). The name was chosen by researchers with that individual's input, not decided by the community. This supersedes the earlier "no sign of community consultation" note. (The meaning "tariuq = salt water/sea" is still to be confirmed from the protologue text.) Igluligaarjuk would still be, as far as we found, the first case where community members themselves choose the names in a workshop. It is also a good illustration of individual-acknowledgement vs community-credit models.
