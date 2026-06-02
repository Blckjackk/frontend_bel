'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/src/features/auth/context/AuthContext';
import type { OfficeSpace } from '@/src/features/offices/types/officeSpace.types';
import { mapOfficeDtoToOfficeSpace } from '@/src/features/offices/types/officeSpace.types';

export default function ProviderOfficesPage() {
  const { user } = useAuth();
  const providerId = user?.id;
  const [offices, setOffices] = useState<OfficeSpace[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<OfficeSpace | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const emptyForm = useMemo(
    () => ({
      title: '',
      location: 'Jakarta Pusat',
      address: '',
      price: 1000000,
      duration: '20 days',
      about: '',
      rating: 4.5,
      tags: ['Popular'],
      image: '/assets/images/thumbnails/thumbnails-1.png',
      images: [] as string[],
      features: [] as string[],
      salesContacts: [] as Array<{ name: string; role: string; photo: string; email: string; phone: string }>,
      isFullyBooked: false,
    }),
    [],
  );

  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([null, null, null]);
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([false, false, false]);

  const fetchProviderData = useCallback(async () => {
    if (!providerId) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
      // 1. Fetch cities
      const cityRes = await fetch(`${apiUrl}/cities`);
      const citiesData = await cityRes.json();
      if (Array.isArray(citiesData)) setCitiesList(citiesData);

      // 2. Fetch offices for this provider
      const officeRes = await fetch(`${apiUrl}/offices?provider_id=${providerId}`);
      const officesData = await officeRes.json();
      if (Array.isArray(officesData)) {
        setOffices(officesData.map(mapOfficeDtoToOfficeSpace));
      } else {
        setOffices([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchProviderData();
  }, [providerId, fetchProviderData]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImagePreview(null);
    setImagePreviews([null, null, null]);
    setIsModalOpen(true);
  };

  const openEdit = (office: OfficeSpace) => {
    setEditing(office);
    setForm({
      title: office.title,
      location: office.location,
      address: office.address,
      price: office.price,
      duration: office.duration,
      about: office.about,
      rating: office.rating,
      tags: office.tags,
      image: office.image,
      images: office.images || [],
      features: office.features || [],
      salesContacts: office.salesContacts || [],
      isFullyBooked: office.isFullyBooked,
    });
    setImagePreview(office.image);
    setImagePreviews(office.images?.slice(0, 3) || [null, null, null]);
    setIsModalOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => ({ ...p, image: data.url }));
      } else {
        alert('Gagal upload gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMultipleImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = event.target?.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    const newUploading = [...uploadingImages];
    newUploading[index] = true;
    setUploadingImages(newUploading);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => {
          const newImages = [...(p.images || [])];
          newImages[index] = data.url;
          return { ...p, images: newImages };
        });
      } else {
        alert('Gagal upload gambar');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image');
    } finally {
      newUploading[index] = false;
      setUploadingImages(newUploading);
    }
  };

  const handleSalesContactImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm((p) => {
          const newContacts = [...p.salesContacts];
          newContacts[index].photo = data.url;
          return { ...p, salesContacts: newContacts };
        });
      } else {
        alert('Gagal upload foto sales');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading sales photo');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setSaving(false);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!providerId) return;
    if (!form.title.trim()) {
      alert('Judul kantor wajib diisi.');
      return;
    }
    if (!form.location.trim()) {
      alert('Lokasi wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      // 1. Resolve city_id dynamically from cities list
      let matchedCity = citiesList.find(
        (c) => c.name.toLowerCase() === form.location.trim().toLowerCase()
      );
      if (!matchedCity && citiesList.length > 0) {
        matchedCity = citiesList[0];
      }
      const cityId = matchedCity ? matchedCity.id : 1;

      // 2. Format additional images
      const mainImage = form.image.trim() || '/assets/images/thumbnails/thumbnails-1.png';
      const additionalImages = Array.isArray(form.images) ? form.images.filter(Boolean) : [];

      const payload = {
        city_id: cityId,
        provider_id: Number(providerId),
        name: form.title.trim(),
        thumbnail: mainImage,
        about: form.about.trim(),
        address: form.address.trim(),
        price: Number(form.price),
        duration_type: form.duration.trim() || '20 days',
        rating: Number(form.rating),
        is_open: true,
        is_full_booked: Boolean(form.isFullyBooked),
        sales_contacts: Array.isArray(form.salesContacts)
          ? form.salesContacts.filter((c) => c.name.trim()) // Relaxed filter to check name only
          : [],
        images: additionalImages,
        feature_names: Array.isArray(form.features)
          ? form.features.filter((f) => f.trim())
          : [],
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let response;
      if (editing) {
        response = await fetch(`${apiUrl}/offices/${editing.id}`, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${apiUrl}/offices`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        alert(editing ? 'Kantor berhasil diperbarui!' : 'Kantor berhasil ditambahkan!');
        fetchProviderData();
        closeModal();
      } else {
        const errorData = await response.json();
        console.error('Save error:', errorData);
        alert(errorData.message || 'Gagal menyimpan data kantor.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFullyBooked = async (office: OfficeSpace) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    try {
      const res = await fetch(`${apiUrl}/offices/${office.id}/fully-booked`, {
        method: 'PATCH',
        headers: headers,
      });
      if (res.ok) {
        fetchProviderData();
      } else {
        alert('Gagal memperbarui status fully booked.');
      }
    } catch {
      alert('Kesalahan jaringan.');
    }
  };

  const handleDelete = async (officeId: number) => {
    const ok = confirm('Hapus kantor ini secara permanen dari database?');
    if (!ok) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${apiUrl}/offices/${officeId}`, {
        method: 'DELETE',
        headers: headers,
      });
      if (res.ok) {
        alert('Kantor berhasil dihapus!');
        fetchProviderData();
      } else {
        alert('Gagal menghapus kantor.');
      }
    } catch {
      alert('Kesalahan jaringan.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-canvas min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#FF852D] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-muted font-bold uppercase tracking-wider">Memuat Daftar Kantor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-canvas p-6 rounded-[20px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg text-[#000929]">Kantor Saya ({offices.length})</h2>
          <p className="text-sm opacity-60 mt-1">Kelola dan update listing kantor aktif Anda</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-full bg-[#FF852D] text-white font-semibold px-6 py-2.5 text-sm hover:opacity-90 transition cursor-pointer"
        >
          + Tambah Kantor
        </button>
      </div>

      {offices.length === 0 ? (
        <div className="bg-white border border-[#E0DEF7] rounded-[20px] p-12 text-center shadow-sm">
          <p className="text-lg font-semibold opacity-60 mb-2">Belum ada kantor terdaftar</p>
          <p className="text-sm opacity-40">Tambahkan kantor pertama Anda dari tombol di kanan atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offices.map((office) => (
            <div key={office.id} className="bg-white border border-hairline rounded-[20px] overflow-hidden shadow-sm flex flex-col">
              <div className="relative h-[180px]">
                <img src={office.image} alt={office.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/images/thumbnails/thumbnails-1.png'; }} />
                {office.isFullyBooked && (
                  <span className="absolute top-4 right-4 bg-[#FF2D2D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Fully Booked
                  </span>
                )}
              </div>
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-[#000929] leading-snug text-base line-clamp-1">{office.title}</h3>
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <Image src="/assets/images/icons/location.svg" width={16} height={16} alt="" />
                    {office.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#FF852D] text-sm">
                      Rp {office.price.toLocaleString('id-ID')}
                      <span className="text-[10px] font-normal opacity-60"> / {office.duration}</span>
                    </p>
                    <span className="text-xs font-bold bg-canvas border border-hairline py-0.5 px-2 rounded-md">⭐ {office.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between pt-2 border-t border-hairline gap-2">
                    <button
                      onClick={() => handleToggleFullyBooked(office)}
                      className="text-xs font-bold px-3.5 py-2 rounded-full border border-hairline hover:border-[#FF852D] transition-all cursor-pointer flex-1 text-center"
                    >
                      {office.isFullyBooked ? 'Set Available' : 'Set Fully Booked'}
                    </button>
                    <button
                      onClick={() => handleDelete(office.id)}
                      className="text-xs font-bold px-3.5 py-2 rounded-full border border-hairline text-[#FF2D2D] hover:bg-[#FF2D2D]/5 transition-all cursor-pointer flex-1 text-center"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/office/${office.slug}`}
                      className="flex-1 text-center rounded-full border border-hairline py-2 text-xs font-bold hover:bg-canvas/80 transition-all"
                    >
                      Lihat
                    </Link>
                    <button
                      onClick={() => openEdit(office)}
                      className="flex-1 rounded-full bg-[#FF852D] text-white py-2 text-xs font-bold hover:opacity-90 transition cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="relative w-full max-w-[720px] bg-white rounded-[20px] border border-[#E0DEF7] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6 border-b border-hairline pb-4">
              <div>
                <h3 className="font-bold text-lg text-[#000929]">{editing ? 'Edit Kantor' : 'Tambah Kantor Baru'}</h3>
                <p className="text-xs opacity-60 mt-1">Simpan data listing Anda langsung ke database MySQL</p>
              </div>
              <button onClick={closeModal} className="text-xs font-bold opacity-60 hover:opacity-100 bg-canvas border border-hairline px-3 py-1 rounded-full">
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Judul</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="Nama kantor"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-ink/80">Lokasi / Kota</label>
                <select
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D] cursor-pointer"
                >
                  {citiesList.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-ink/80">Harga (Rp)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-ink/80">Durasi</label>
                <input
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="20 days"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-ink/80">Rating</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Alamat Lengkap</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="Alamat detail kantor"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Deskripsi</label>
                <textarea
                  value={form.about}
                  onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D] min-h-[100px]"
                  placeholder="Tentang kantor"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Gambar Kantor Utama</label>
                <div className="mt-1.5 flex flex-col gap-3">
                  {imagePreview && (
                    <div className="w-full h-[150px] rounded-[12px] overflow-hidden border border-hairline">
                      <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                    className="w-full border border-hairline rounded-[12px] px-4 py-2.5 text-xs outline-none cursor-pointer bg-white"
                  />
                  {uploadingImage && <p className="text-xs text-[#FF852D]">Uploading...</p>}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Gambar Kantor Tambahan (3 foto)</label>
                <div className="mt-1.5 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      {imagePreviews[idx] && (
                        <div className="w-full h-[100px] rounded-[12px] overflow-hidden border border-hairline">
                          <img src={imagePreviews[idx]!} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleMultipleImageChange(idx, e)}
                        disabled={uploadingImages[idx]}
                        className="w-full border border-hairline rounded-[8px] px-2 py-2 text-[10px] outline-none bg-white cursor-pointer"
                      />
                      {uploadingImages[idx] && <p className="text-xs text-[#FF852D]">Uploading...</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-ink/80">Fasilitas / Features (pisahkan dengan koma)</label>
                <input
                  value={Array.isArray(form.features) ? form.features.join(', ') : ''}
                  onChange={(e) => setForm((p) => ({ ...p, features: e.target.value.split(',').map((f) => f.trim()).filter(Boolean) }))}
                  className="mt-1.5 w-full border border-[#E0DEF7] rounded-[12px] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF852D]"
                  placeholder="High Speed Wifi, 100% Privacy, Free Move, Sustainability, Parking Space, Compact"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-3 border-t border-hairline pt-4 mt-2">
                  <label className="text-xs font-bold uppercase text-ink/80">Sales Contacts</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((p) => ({
                        ...p,
                        salesContacts: [...(p.salesContacts || []), { name: '', role: '', photo: '', email: '', phone: '' }],
                      }));
                    }}
                    className="text-xs font-bold text-[#FF852D] hover:opacity-80"
                  >
                    + Tambah Contact
                  </button>
                </div>
                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                  {Array.isArray(form.salesContacts) && form.salesContacts.length > 0 ? (
                    form.salesContacts.map((contact, idx) => (
                      <div key={idx} className="border border-hairline rounded-[12px] p-3 space-y-2 bg-canvas/30">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={contact.name}
                            onChange={(e) => {
                              const newContacts = [...form.salesContacts];
                              newContacts[idx].name = e.target.value;
                              setForm((p) => ({ ...p, salesContacts: newContacts }));
                            }}
                            className="border border-[#E0DEF7] rounded-[8px] px-2.5 py-2 text-xs outline-none bg-white"
                            placeholder="Nama Sales"
                          />
                          <input
                            value={contact.role}
                            onChange={(e) => {
                              const newContacts = [...form.salesContacts];
                              newContacts[idx].role = e.target.value;
                              setForm((p) => ({ ...p, salesContacts: newContacts }));
                            }}
                            className="border border-[#E0DEF7] rounded-[8px] px-2.5 py-2 text-xs outline-none bg-white"
                            placeholder="Role (Sales Manager, etc)"
                          />
                        </div>
                        <input
                          value={contact.email}
                          onChange={(e) => {
                            const newContacts = [...form.salesContacts];
                            newContacts[idx].email = e.target.value;
                            setForm((p) => ({ ...p, salesContacts: newContacts }));
                          }}
                          className="w-full border border-[#E0DEF7] rounded-[8px] px-2.5 py-2 text-xs outline-none bg-white"
                          placeholder="Email"
                        />
                        <input
                          value={contact.phone}
                          onChange={(e) => {
                            const newContacts = [...form.salesContacts];
                            newContacts[idx].phone = e.target.value;
                            setForm((p) => ({ ...p, salesContacts: newContacts }));
                          }}
                          className="w-full border border-[#E0DEF7] rounded-[8px] px-2.5 py-2 text-xs outline-none bg-white"
                          placeholder="No Telepon"
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-ink/60">Foto Profile Sales</label>
                          {contact.photo && (
                            <div className="w-[50px] h-[50px] rounded-full overflow-hidden border border-[#E0DEF7] my-1">
                              <img src={contact.photo} alt={contact.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/assets/images/photos/photo-1.png'; }} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSalesContactImageChange(idx, e)}
                            className="w-full border border-hairline rounded-[8px] px-2 py-1.5 text-[10px] bg-white cursor-pointer"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((p) => ({
                              ...p,
                              salesContacts: p.salesContacts.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="w-full text-xs font-bold text-[#FF2D2D] hover:opacity-80 py-1 bg-[#FF2D2D]/5 rounded-md mt-1"
                        >
                          Hapus Contact
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs opacity-50 text-center py-2">Belum ada sales contact yang ditambahkan.</p>
                  )}
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-between gap-4 rounded-[12px] border border-hairline px-4 py-3 bg-[#FF2D2D]/5">
                <div>
                  <p className="text-sm font-semibold text-[#000929]">Fully Booked Status</p>
                  <p className="text-xs opacity-60">Pecah status booking kantor agar user tidak bisa booking.</p>
                </div>
                <button
                  onClick={() => setForm((p) => ({ ...p, isFullyBooked: !p.isFullyBooked }))}
                  className="text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-all"
                  style={{ backgroundColor: form.isFullyBooked ? '#FF2D2D' : '#F7F7FD', color: form.isFullyBooked ? 'white' : '#000929' }}
                >
                  {form.isFullyBooked ? 'FULLY BOOKED' : 'AVAILABLE'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 border-t border-hairline pt-4">
              <button
                onClick={closeModal}
                className="rounded-full border border-hairline px-6 py-2 text-xs font-bold hover:bg-canvas/80 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-[#FF852D] text-white px-6 py-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
