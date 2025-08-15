-- Schéma PostgreSQL pour BabsDigitaliste
-- Compatible avec Supabase

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des images
CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category_id INTEGER,
    album_name VARCHAR(255),
    event_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des catégories par défaut
INSERT INTO categories (name, slug, description) VALUES
('Nature', 'nature', 'Photographies de paysages naturels'),
('Shooting', 'shooting', 'Sessions photo professionnelles'),
('Mariage', 'mariage', 'Cérémonies et événements de mariage'),
('Événement', 'evenement', 'Événements et cérémonies'),
('Politique', 'politique', 'Événements politiques'),
('Cultures', 'cultures', 'Événements culturels'),
('Vidéos', 'videos', 'Contenus vidéo')
ON CONFLICT (slug) DO NOTHING;

-- Créer un admin par défaut (mot de passe: admin123)
INSERT INTO admins (username, email, password_hash) VALUES 
('admin', 'admin@babsdigitaliste.com', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category_id);
CREATE INDEX IF NOT EXISTS idx_images_featured ON images(is_featured);
CREATE INDEX IF NOT EXISTS idx_images_sort ON images(sort_order);
CREATE INDEX IF NOT EXISTS idx_images_album ON images(album_name);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_updated_at 
    BEFORE UPDATE ON images 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON admins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 