## A guide to Entity Framework

To make a foreign key nullable, add a ? after the type:

        [Column("file_ptr_id")]
        public int? FilePtrId { get; set; }

    public virtual FilePtr? FilePtr { get; set; }
