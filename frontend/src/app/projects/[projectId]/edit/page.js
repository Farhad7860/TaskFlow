'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectDetails, updateProject } from '@redux/slices/projectSlice';
import { sendInvitation } from '@redux/slices/invitationSlice';
import { useRouter } from 'next/navigation';

export default function EditProjectPage({ params }) {
  const { projectId } = params; // ✅ CORRECT WAY (App Router)
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    projectDetails,
    isLoading: projectLoading,
    error: projectError,
  } = useSelector((state) => state.project);

  const {
    isLoading: invitationLoading,
    error: invitationError,
  } = useSelector((state) => state.invitation);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  /* Fetch project */
  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectDetails(projectId));
    }
  }, [dispatch, projectId]);

  /* Populate form */
  useEffect(() => {
    if (projectDetails) {
      setName(projectDetails.name || '');
      setDescription(projectDetails.description || '');
    }
  }, [projectDetails]);

  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateProject({
        projectId,
        updates: { name, description },
      })
    );

    if (!result.error) {
      alert('Project updated successfully!');
      router.push(`/projects/${projectId}`);
    }
  };

  const handleSendInvitation = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      sendInvitation({
        projectId,
        recipientId: email,
        message,
      })
    );

    if (!result.error) {
      alert('Invitation sent successfully!');
      setEmail('');
      setMessage('');
    }
  };

  if (projectLoading) {
    return <p className="p-6">Loading project details...</p>;
  }

  if (projectError) {
    return <p className="p-6 text-red-500">{projectError}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-6">Edit Project</h1>

      {/* Update Project */}
      <form onSubmit={handleUpdateProject} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Project Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Project Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={projectLoading}
        >
          {projectLoading ? 'Updating...' : 'Update Project'}
        </button>
      </form>

      {/* Invitation */}
      <hr className="my-8" />

      <h2 className="text-xl font-semibold mb-4">Send Invitation</h2>

      <form onSubmit={handleSendInvitation} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Recipient Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Message</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={invitationLoading}
        >
          {invitationLoading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>

      {invitationError && (
        <p className="text-red-500 mt-4">{invitationError}</p>
      )}
    </div>
  );
}
