use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use tsync::tsync;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
#[tsync]
pub(crate) struct Seed {
    pub id: Uuid,
    pub phrase: String,
    pub seed_type: SeedType,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[tsync]
pub(crate) enum SeedType {
    Created { timestamp: DateTime<Utc> },
    Imported { timestamp: DateTime<Utc> },
}
