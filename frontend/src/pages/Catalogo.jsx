import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../style/catalogo.css';

const PER_PAGE = 10;
const PAGE_GROUP_SIZE = 5;

function Catalogo() {
    const [carte, setCarte] = useState([]);
    const [filtrate, setFiltrate] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const [loading, setLoading] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();

    // Leggi i filtri dalla URL
    const [search, setSearch] = useState(searchParams.get("search") || '');
    const [type, setType] = useState(searchParams.get("type") || '');
    const [attribute, setAttribute] = useState(searchParams.get("attribute") || '');
    const [level, setLevel] = useState(searchParams.get("level") || '');
    const [minAtk, setMinAtk] = useState(searchParams.get("minAtk") || '');
    const [maxAtk, setMaxAtk] = useState(searchParams.get("maxAtk") || '');
    const [minDef, setMinDef] = useState(searchParams.get("minDef") || '');
    const [maxDef, setMaxDef] = useState(searchParams.get("maxDef") || '');
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);

    // Aggiorna la query string ogni volta che filtri o pagina cambiano
    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (type) params.type = type;
        if (attribute) params.attribute = attribute;
        if (level) params.level = level;
        if (minAtk) params.minAtk = minAtk;
        if (maxAtk) params.maxAtk = maxAtk;
        if (minDef) params.minDef = minDef;
        if (maxDef) params.maxDef = maxDef;
        if (currentPage > 1) params.page = currentPage;

        setSearchParams(params);
    }, [search, type, attribute, level, minAtk, maxAtk, minDef, maxDef, currentPage, setSearchParams]);

    useEffect(() => {
        setLoading(true);
        fetch('http://127.0.0.1:5000/carte')
            .then(res => res.json())
            .then(data => {
                setCarte(data);
                setFiltrate(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const f = carte.filter(c => {
            const nameMatch = c.name?.toLowerCase().includes(search.toLowerCase());
            const typeMatch = type ? c.type === type : true;
            const attrMatch = attribute ? c.attribute === attribute : true;
            const levelMatch = level ? Number(c.level) === Number(level) : true;
            const atk = parseInt(c.atk);
            const def = parseInt(c.def);
            const atkMatch = (!minAtk || atk >= minAtk) && (!maxAtk || atk <= maxAtk);
            const defMatch = (!minDef || def >= minDef) && (!maxDef || def <= maxDef);
            return nameMatch && typeMatch && attrMatch && levelMatch && atkMatch && defMatch;
        });
        setFiltrate(f);
        setCurrentPage(parseInt(searchParams.get("page")) || 1);
    }, [search, type, attribute, level, minAtk, maxAtk, minDef, maxDef, carte]);

    const uniqueTypes = [...new Set(carte.map(c => c.type).filter(Boolean))];
    const uniqueAttributes = [...new Set(carte.map(c => c.attribute).filter(Boolean))];
    const uniqueLevels = [...new Set(carte.map(c => c.level).filter(Boolean))].sort((a, b) => a - b);

    const totalPages = Math.ceil(filtrate.length / PER_PAGE);
    const paginated = filtrate.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const currentGroup = Math.floor((currentPage - 1) / PAGE_GROUP_SIZE);
    const startPage = currentGroup * PAGE_GROUP_SIZE + 1;
    const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
    const pages = [];
    for (let i = startPage; i <= endPage; i++) pages.push(i);

    const handlePageInput = e => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= totalPages) setCurrentPage(value);
    };

    const resetFilters = () => {
        setSearch('');
        setType('');
        setAttribute('');
        setLevel('');
        setMinAtk('');
        setMaxAtk('');
        setMinDef('');
        setMaxDef('');
        setCurrentPage(1);
    };

    return (
        <div className="catalogo-container">
            <h1>Catalogo Carte</h1>

            <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? 'Nascondi Filtri ▲' : 'Mostra Filtri ▼'}
            </button>

            {showFilters && (
                <div className="catalogo-filters">
                    <div className="filter-row">
                        <input type="text" placeholder="Cerca per nome" value={search} onChange={e => setSearch(e.target.value)} />
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="">Tutti i tipi</option>
                            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <select value={attribute} onChange={e => setAttribute(e.target.value)}>
                            <option value="">Tutti gli attributi</option>
                            {uniqueAttributes.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                        <select value={level} onChange={e => setLevel(e.target.value)}>
                            <option value="">Qualsiasi livello</option>
                            {uniqueLevels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="filter-row">
                        <input type="number" placeholder="Min ATK" value={minAtk} onChange={e => setMinAtk(e.target.value)} />
                        <input type="number" placeholder="Max ATK" value={maxAtk} onChange={e => setMaxAtk(e.target.value)} />
                        <input type="number" placeholder="Min DEF" value={minDef} onChange={e => setMinDef(e.target.value)} />
                        <input type="number" placeholder="Max DEF" value={maxDef} onChange={e => setMaxDef(e.target.value)} />
                    </div>

                    <button type="button" className="azzera-btn" onClick={resetFilters}>
                        Azzera filtro
                    </button>
                </div>
            )}

            {loading ? <p>Caricamento...</p> : (
                <>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {paginated.map(c => (
                            <Link
                                key={c._id}
                                to={`/carta/${c._id}?${searchParams.toString()}`}
                                className="card-link"
                            >
                                <div className="card">
                                    <h3>{c.name}</h3>
                                    {c.image_url && <img src={c.image_url} alt={c.name} />}
                                    <p>Tipo: {c.type}</p>
                                    {c.attribute && <p>Attributo: {c.attribute}</p>}
                                    {c.level && <p>Livello: {c.level}</p>}
                                    {c.atk && <p>ATK: {c.atk}</p>}
                                    {c.def && <p>DEF: {c.def}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="pagination">
                        <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>←</button>
                        {pages.map(p => (
                            <button
                                key={p}
                                className={`page-btn${p === currentPage ? ' active' : ''}`}
                                onClick={() => setCurrentPage(p)}
                            >
                                {p}
                            </button>
                        ))}
                        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>→</button>
                        <span style={{ marginLeft: '10px' }}>Vai alla pagina:</span>
                        <input type="number" min={1} max={totalPages} onChange={handlePageInput} style={{ width: '60px' }} />
                    </div>
                </>
            )}
        </div>
    );
}

export default Catalogo;
