import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiKey, FiTrash2, FiLogOut, FiHome, FiPlus, FiX } from 'react-icons/fi';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff';
const ADDRESS_TAGS = ['Home', 'Office', 'Buy for someone else', 'Other'];

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || defaultAvatar);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const fileInputRef = useRef();
  const [editingContact, setEditingContact] = useState(false);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [addressForm, setAddressForm] = useState({ value: '', tag: 'Home', customTag: '' });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressError, setAddressError] = useState('');

  if (!user) {
    return <div className="max-w-xl mx-auto p-6">Not logged in.</div>;
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateUser({ ...user, name, email, phone, address, avatar });
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    // Save password to user (for demo, not secure)
    updateUser({ ...user, password });
    setPassword('');
    setConfirmPassword('');
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 2000);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      logout();
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Save addresses to user
  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    updateUser({ ...user, addresses: newAddresses });
    setAddressSuccess(true);
    setTimeout(() => setAddressSuccess(false), 2000);
  };

  // Add or update address
  const handleAddressFormSubmit = (e) => {
    e.preventDefault();
    const tag = addressForm.tag === 'Other' ? addressForm.customTag : addressForm.tag;
    if (!addressForm.value.trim() || !tag.trim()) return;
    // Check for duplicate tag (ignore current editing index)
    const duplicateIdx = addresses.findIndex((a, i) => a.tag.toLowerCase() === tag.toLowerCase() && i !== editingAddressIdx);
    if (duplicateIdx !== -1) {
      setAddressError('An address with this tag already exists.');
      return;
    }
    setAddressError('');
    let newAddresses = [...addresses];
    if (editingAddressIdx !== null) {
      newAddresses[editingAddressIdx] = { value: addressForm.value, tag };
    } else {
      newAddresses.push({ value: addressForm.value, tag });
    }
    saveAddresses(newAddresses);
    setShowAddressForm(false);
    setEditingAddressIdx(null);
    setAddressForm({ value: '', tag: 'Home', customTag: '' });
  };

  // Edit address
  const handleEditAddress = (idx) => {
    setEditingAddressIdx(idx);
    setAddressForm({
      value: addresses[idx].value,
      tag: ADDRESS_TAGS.includes(addresses[idx].tag) ? addresses[idx].tag : 'Other',
      customTag: ADDRESS_TAGS.includes(addresses[idx].tag) ? '' : addresses[idx].tag,
    });
    setShowAddressForm(true);
  };

  // Delete address
  const handleDeleteAddress = (idx) => {
    if (window.confirm('Delete this address?')) {
      const newAddresses = addresses.filter((_, i) => i !== idx);
      saveAddresses(newAddresses);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 text-primary-700 flex items-center gap-2"><FiUser className="text-primary-500" /> Profile</h1>
      <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-10 transition-all duration-500">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-8 animate-slide-in-down">
          <div className="relative group">
            <img src={avatar} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-primary-200 ring-4 ring-primary-100 shadow-lg transition-transform duration-300 group-hover:scale-105" />
            {editingContact && (
              <button
                className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-2 shadow hover:bg-primary-700 border-2 border-white transition-transform duration-200 hover:scale-110"
                onClick={() => fileInputRef.current.click()}
                type="button"
                title="Change avatar"
              >
                <FiEdit2 />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
              disabled={!editingContact}
            />
          </div>
          <div>
            <div className="text-2xl font-semibold text-gray-900 flex items-center gap-2">{name}</div>
            <div className="text-gray-500 flex items-center gap-2"><FiMail className="inline" /> {email}</div>
            <div className="text-gray-400 text-sm mt-1">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</div>
          </div>
        </div>
        {/* Contact Details Section */}
        <div className="border-t pt-6 mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2"><FiPhone className="text-primary-500" /> Contact Details</h2>
          {editingContact ? (
            <form onSubmit={e => { e.preventDefault(); updateUser({ ...user, name, email, phone, avatar }); setEditingContact(false); setSuccess(true); setTimeout(() => setSuccess(false), 2000); }} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="input-field w-full" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input-field w-full" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" className="input-field w-full" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow">Save</button>
                <button type="button" className="bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow" onClick={() => { setEditingContact(false); setName(user.name); setEmail(user.email); setPhone(user.phone || ''); setAvatar(user.avatar || defaultAvatar); }}>Cancel</button>
              </div>
              {success && <div className="text-green-600 animate-fade-in">Contact details updated!</div>}
            </form>
          ) : (
            <div className="flex items-center gap-8">
              <div>
                <div className="font-medium flex items-center gap-1"><FiUser /> Name:</div>
                <div className="text-gray-800">{name}</div>
                <div className="font-medium mt-2 flex items-center gap-1"><FiMail /> Email:</div>
                <div className="text-gray-800">{email}</div>
                <div className="font-medium mt-2 flex items-center gap-1"><FiPhone /> Phone:</div>
                <div className="text-gray-800">{phone || <span className='text-gray-400'>No phone set.</span>}</div>
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white px-3 py-1 rounded-md font-medium transition-all duration-200 shadow flex items-center gap-1" onClick={() => setEditingContact(true)}><FiEdit2 /> Edit</button>
            </div>
          )}
        </div>
        {/* Delivery Address Section */}
        <div className="border-t pt-6 mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2"><FiHome className="text-primary-500" /> Delivery Addresses</h2>
          {/* List addresses */}
          {addresses.length === 0 && <div className="text-gray-400 mb-4">No addresses added.</div>}
          <div className="flex flex-col gap-4 mb-4">
            {addresses.map((addr, idx) => (
              <div key={idx} className="flex items-start gap-4 bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="flex-1">
                  <div className="font-semibold text-primary-700 flex items-center gap-2">
                    <FiMapPin /> {addr.tag}
                  </div>
                  <div className="text-gray-700 whitespace-pre-line mt-1">{addr.value}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full p-2" onClick={() => handleEditAddress(idx)} title="Edit"><FiEdit2 /></button>
                  <button className="bg-red-100 hover:bg-red-200 text-red-700 rounded-full p-2" onClick={() => handleDeleteAddress(idx)} title="Delete"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
          {/* Add/Edit address form */}
          {showAddressForm ? (
            <form onSubmit={handleAddressFormSubmit} className="bg-white rounded-lg shadow p-4 flex flex-col gap-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  className="input-field w-full min-h-[60px]"
                  value={addressForm.value}
                  onChange={e => setAddressForm({ ...addressForm, value: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                <div className="flex gap-2 flex-wrap">
                  {ADDRESS_TAGS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      className={`px-3 py-1 rounded-full border ${addressForm.tag === tag ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'} font-medium transition-colors`}
                      onClick={() => setAddressForm({ ...addressForm, tag, customTag: '' })}
                    >
                      {tag}
                    </button>
                  ))}
                  <input
                    type="text"
                    placeholder="Custom tag"
                    className="input-field px-3 py-1 rounded-full border border-gray-300 w-32"
                    value={addressForm.tag === 'Other' ? addressForm.customTag : ''}
                    onChange={e => setAddressForm({ ...addressForm, tag: 'Other', customTag: e.target.value })}
                    disabled={addressForm.tag !== 'Other'}
                  />
                </div>
              </div>
              {addressError && <div className="text-red-600 text-sm">{addressError}</div>}
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors">{editingAddressIdx !== null ? 'Update' : 'Add'} Address</button>
                <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors" onClick={() => { setShowAddressForm(false); setEditingAddressIdx(null); setAddressForm({ value: '', tag: 'Home', customTag: '' }); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors" onClick={() => { setShowAddressForm(true); setEditingAddressIdx(null); setAddressForm({ value: '', tag: 'Home', customTag: '' }); }}><FiPlus /> Add Address</button>
          )}
          {addressSuccess && <div className="text-green-600 mt-2 animate-fade-in">Addresses updated!</div>}
        </div>
        {/* Password Change */}
        <div className="border-t pt-6 mt-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-4 text-primary-700 flex items-center gap-2"><FiKey className="text-primary-500" /> Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                disabled={editingContact || editingAddress}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field w-full"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6}
                disabled={editingContact || editingAddress}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="showPassword" checked={showPassword} onChange={e => setShowPassword(e.target.checked)} disabled={editingContact || editingAddress} />
              <label htmlFor="showPassword" className="text-sm text-gray-600">Show Password</label>
            </div>
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow" disabled={editingContact || editingAddress}>Change Password</button>
            {passwordSuccess && <div className="text-green-600 animate-fade-in">Password changed!</div>}
            {passwordError && <div className="text-red-600 animate-fade-in">{passwordError}</div>}
          </form>
        </div>
        {/* Account Actions */}
        <div className="border-t pt-6 mt-6 flex flex-col gap-3 animate-fade-in">
          <button className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 shadow flex items-center gap-2" onClick={handleDeleteAccount}><FiTrash2 /> Delete Account</button>
          <button className="bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700 px-4 py-2 rounded-md font-medium transition-all duration-200 shadow flex items-center gap-2" onClick={() => { logout(); navigate('/login'); }}><FiLogOut /> Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 