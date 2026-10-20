# Keep reads that belong to this genome, from minimap2 primary alignments (SAM, no header).
# Input: contigs.bed first (contig lengths), then SAM on stdin.  Output: FASTQ.
#   identity : minimap2 gap-compressed divergence de <= MAXDE (default 0.04, i.e. >= 96%)
#   clipping : a clipped end longer than MAXCLIP bp is allowed only where the alignment
#              reaches a contig end (within EDGE bp), where it may extend into a gap;
#              long clips in the middle of a contig mark chimeras or other genomes
#   awk -v MAXDE=0.04 -f filter_reads.awk contigs.bed - > reads.fastq
BEGIN { OFS = "\t"; if (!MAXDE) MAXDE = 0.04; if (!MAXCLIP) MAXCLIP = 500; if (!EDGE) EDGE = 2000 }
FNR == NR { clen[$1] = $3; next }
/^@/ { next }
{
    de = 1
    for (i = 12; i <= NF; i++) if (substr($i, 1, 5) == "de:f:") de = substr($i, 6) + 0
    if (de > MAXDE) { drop_id++; next }
    cig = $6; span = 0; lclip = 0; rclip = 0; first = 1
    while (match(cig, /^[0-9]+[MIDNSHP=X]/)) {
        n = substr(cig, 1, RLENGTH - 1) + 0; op = substr(cig, RLENGTH, 1)
        if (op == "S" || op == "H") { if (first) lclip = n; else rclip = n }
        if (op == "M" || op == "D" || op == "N" || op == "=" || op == "X") span += n
        if (op != "S" && op != "H") first = 0
        cig = substr(cig, RLENGTH + 1)
    }
    start = $4; end = $4 + span - 1; L = clen[$3]
    if (lclip > MAXCLIP && start > EDGE) { drop_clip++; next }
    if (rclip > MAXCLIP && end < L - EDGE) { drop_clip++; next }
    kept++
    print "@" $1 "\n" $10 "\n+\n" $11
}
END { printf "[INFO] reads kept %d, dropped for identity %d, dropped for mid-contig clipping %d\n", kept, drop_id, drop_clip > "/dev/stderr" }
