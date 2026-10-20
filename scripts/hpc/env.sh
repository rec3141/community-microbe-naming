# Site paths for the HPC helpers. Every script sources this file, so a new cluster only
# needs these values changed (or exported before running). Defaults are the ones used on
# Grex (University of Manitoba) for the Igluligaarjuk workshop.
#   HELPERS     this folder (scripts/hpc) on the cluster
#   PROJECT     danaSeq project folder holding assembly_*/ mag_*/ runs and input_* read folders
#   BIND_DIR    a real (non-symlink) path that covers PROJECT, bound into the containers
#   NANO_SIF    danaSeq nanopore_assembly container (minimap2, samtools, CoverM, tetramer_freqs)
#   MAG_SIF     danaSeq mag_analysis container (CheckM2, GTDB-Tk, barrnap, tRNAscan-SE, ...)
#   GTDB_SQSH   GTDB-Tk reference data as a squashfs image
#   CHECKM2_DB  folder containing the CheckM2 .dmnd database
#   LOCAL_META  per-sample metadata TSV for the community's own samples (flowcell, barcode,
#               location, lat, lon, sample_date, station_id); private, never committed
export HELPERS=${HELPERS:-$HOME/scratch/tmp_claude}
export PROJECT=${PROJECT:-$HOME/scratch/project_nanopore}
export BIND_DIR=${BIND_DIR:-$(readlink -f "$HOME/scratch")}
export NANO_SIF=$(readlink -f "${NANO_SIF:-$HOME/GENICE/danaSeq/nanopore_assembly/.danaseq-nanopore-assembly.sif}")
export MAG_SIF=$(readlink -f "${MAG_SIF:-$HOME/GENICE/danaSeq/mag_analysis/.danaseq-mag-analysis.sif}")
export GTDB_SQSH=${GTDB_SQSH:-$HOME/scratch/databases/gtdbtk-db.sqsh}
export CHECKM2_DB=${CHECKM2_DB:-$HOME/scratch/databases/checkm2_db}
export LOCAL_META=${LOCAL_META:-$HELPERS/local_metadata.tsv}
[ -d /opt/singularity-ce-4.4.1/bin ] && export PATH=/opt/singularity-ce-4.4.1/bin:$PATH
# The community's own samples, from LOCAL_META: sites (its `location` values) that are marine;
# every other site with a location counts as freshwater. Samples to drop (e.g. extraction
# controls), comma-separated FLOWCELL_barcodeNN.
export LOCAL_MARINE_SITES=${LOCAL_MARINE_SITES:-Itivia,Dock,Tuktuttaa,Tuktuttaa algae}
export LOCAL_EXCLUDE=${LOCAL_EXCLUDE:-FAZ28565_barcode09}
# the community's build_config.json (candidate MAG ids for cand_abund.py / cand_identity.py)
export BUILD_CONFIG=${BUILD_CONFIG:-$HELPERS/../../communities/igluligaarjuk/build_config.json}
