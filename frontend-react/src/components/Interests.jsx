import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  BsSun, BsTree, BsBank, BsStars,
  BsBuildings, BsFlower1, BsMoon
} from 'react-icons/bs';
import { LuWaves, LuMountain } from 'react-icons/lu';
import { FaMasksTheater } from 'react-icons/fa6';
import { getAllInterests, saveUserInterests } from '../services/interestService';
import { syncProfile } from '../services/recommendationService';
import { useUser } from '../contexts/UserContext';
import InterestSelector from './InterestSelector';
import LoadingButton from './ui/LoadingButton';
import SkeletonGrid from './ui/SkeletonGrid';
import { toast } from 'react-toastify';

const FALLBACK_INTERESTS = [
  { id: 'cat_beach',      name: 'Beach',      type: 'category', icon: <BsSun size={28} /> },
  { id: 'cat_nature',     name: 'Nature',     type: 'category', icon: <BsTree size={28} /> },
  { id: 'cat_mountains',  name: 'Mountains',  type: 'category', icon: <LuMountain size={28} /> },
  { id: 'cat_historical', name: 'Historical', type: 'category', icon: <BsBank size={28} /> },
  { id: 'cat_festivals',  name: 'Festivals',  type: 'category', icon: <FaMasksTheater size={28} /> },
  { id: 'cat_other',      name: 'Other',      type: 'category', icon: <BsStars size={28} /> },

  { id: 'city_riyadh',  name: 'Riyadh',  type: 'city', icon: <BsBuildings size={28} /> },
  { id: 'city_jeddah',  name: 'Jeddah',  type: 'city', icon: <LuWaves size={28} /> },
  { id: 'city_abha',    name: 'Abha',    type: 'city', icon: <BsTree size={28} /> },
  { id: 'city_alula',   name: 'Al Ula',  type: 'city', icon: <BsSun size={28} /> },
  { id: 'city_taif',    name: 'Taif',    type: 'city', icon: <BsFlower1 size={28} /> },
  { id: 'city_tabuk',   name: 'Tabuk',   type: 'city', icon: <BsSun size={28} /> },
  { id: 'city_medina',  name: 'Medina',  type: 'city', icon: <BsMoon size={28} /> },
  { id: 'city_jizan',   name: 'Jizan',   type: 'city', icon: <BsTree size={28} /> },
  { id: 'city_hail',    name: 'Hail',    type: 'city', icon: <BsSun size={28} /> },
  { id: 'city_najran',  name: 'Najran',  type: 'city', icon: <BsFlower1 size={28} /> },
  { id: 'city_ahsa',    name: 'Al Ahsa', type: 'city', icon: <BsTree size={28} /> },
  { id: 'city_dammam',  name: 'Dammam',  type: 'city', icon: <BsBuildings size={28} /> },
];

export default function Interests() {
  const { user, setInterests } = useUser();
  const navigate = useNavigate();
  const [available, setAvailable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllInterests()
      .then((res) => {
        const data = res.data;
        const enriched =
          data.length > 0
            ? data.map((item) => {
                const fallback = FALLBACK_INTERESTS.find((f) => f.name === item.name);
                return {
                  ...item,
                  type: item.type || fallback?.type || 'category',
                  icon: item.icon || fallback?.icon || null,
                };
              })
            : FALLBACK_INTERESTS;
        setAvailable(enriched.length > 0 ? enriched : FALLBACK_INTERESTS);
      })
      .catch(() => {
        toast.error('Failed to load interests from server');
        setAvailable(FALLBACK_INTERESTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) {
      toast.info('Please select at least one interest');
      return;
    }
    setSaving(true);

    const selectedItems = available.filter((item) => selectedIds.includes(item.id));

    // Persist numeric IDs (both cities and categories) to backend
    const numericIds = selectedIds.filter(
      (id) => typeof id === 'number' || !isNaN(Number(id))
    ).map((id) => Number(id));

    if (user?.id && numericIds.length > 0) {
      try {
        await saveUserInterests(user.id, numericIds);
      } catch (err) {
        console.error('Failed to save interests to server:', err);
        toast.error('Failed to save interests to server');
      }
    }

    setInterests(selectedItems);
    localStorage.setItem('userInterests', JSON.stringify(selectedItems));

    // Ensure Python recommendation engine receives the profile before navigating
    if (user?.id) {
      try {
        await syncProfile(
          user.id,
          selectedItems,
          []
        );
      } catch (err) {
        console.error('Profile sync failed (non-critical):', err);
      }
    }

    toast.success('Interests saved successfully!');
    navigate('/home');
    setSaving(false);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">What are you interested in?</h2>
          <p className="text-muted">Loading options...</p>
        </div>
        <SkeletonGrid count={6} columns={3} />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">What are you interested in?</h2>
        <p className="text-muted">
          Select your interests to get personalized recommendations
        </p>
        {selectedIds.length > 0 && (
          <p className="text-success fw-semibold">
            {selectedIds.length} selected
          </p>
        )}
      </div>

      <InterestSelector
        available={available}
        selectedIds={selectedIds}
        onToggle={handleToggle}
        mode="page"
      />

      <div className="text-center mt-5">
        <LoadingButton
          loading={saving}
          loadingText="Saving..."
          variant="success"
          size="lg"
          onClick={handleSave}
          disabled={saving || selectedIds.length === 0}
          style={{ minWidth: '200px' }}
        >
          Continue with {selectedIds.length} interests
        </LoadingButton>
      </div>
    </Container>
  );
}
