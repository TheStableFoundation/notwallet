#[derive(uniffi::Record)]
pub struct Seed {
    /// The UUID identifier of the seed.
    pub id: String,
    pub phrase: String,
    pub seed_type: SeedType,
}

#[derive(uniffi::Enum)]
pub enum SeedType {
    Created { timestamp: String },
    Imported { timestamp: String },
}
