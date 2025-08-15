import { useState } from 'react';
import { X, Users, Mail, Shield, Crown, User } from 'lucide-react';
import { invitationService } from '../../services';
import { formatErrorMessage } from '../../utils/helpers';
import type { CreateInvitationRequest } from '../../types';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  companyName: string;
  onInviteSent?: () => void;
}

export const InviteUserModal = ({ isOpen, onClose, companyId, companyName, onInviteSent }: InviteUserModalProps) => {
  const [formData, setFormData] = useState<CreateInvitationRequest>({
    email: '',
    role: 'MEMBER',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await invitationService.sendInvitation(companyId, formData);
      setSuccess('Invitation sent successfully!');
      setFormData({ email: '', role: 'MEMBER', message: '' });
      onInviteSent?.();
      
      // Close modal after a delay
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (error) {
      setError(formatErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', role: 'MEMBER', message: '' });
    setError(null);
    setSuccess(null);
    onClose();
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-amber-600" />;
      case 'ADMIN': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'OWNER': return 'Full access to company settings and all features';
      case 'ADMIN': return 'Manage company members and most features';
      case 'MEMBER': return 'Basic access to company features';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Invite User</h2>
              <p className="text-sm text-gray-500">Add a new member to {companyName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="user@example.com"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              The user must already be registered in the system
            </p>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="space-y-2">
              {(['MEMBER', 'ADMIN', 'OWNER'] as const).map((role) => (
                <label
                  key={role}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.role === role
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    {getRoleIcon(role)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-800">{role}</span>
                        {formData.role === role && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              placeholder="Add a personal message to the invitation..."
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
