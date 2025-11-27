import React, { useState } from 'react';
import {askChat} from '../api'

export default function ContactActions() {
const [formData, setFormData] = useState({
  fullName: "",
  email: "",
  mobileNo: "",
  subject: "",
  message: "",
  context: "Home"
});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Contact details
  const phoneNumber = '95903 00911';
  const email = 'admissions@vupune.ac.in';
  const address = 'Vishwakarma University, Survey No 2,3,4 Laxminagar, Kondhwa (Bk.) Pune 411048';

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo.replace(/\D/g, ''))) {
      newErrors.mobileNo = 'Phone number must be 10 digits';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      subject: formData.subject,
      message: formData.message,
      context: "Contact-Us"
    };

    const response = await askChat(payload); // ⬅ send to backend

    console.log("Saved to DB:", response);

    setSubmitSuccess(true);
  setFormData({
    fullName: '',
    email: '',
    mobileNo: '',
    subject: '',
    message: '',
  });


    setTimeout(() => setSubmitSuccess(false), 5000);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
 <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          overflow-y: auto;
        }

        .contact-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 50px;
          animation: fadeInDown 0.6s ease-out;
        }

        .page-header h1 {
          font-size: 2.5rem;
          color: #003d5c;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .page-header p {
          font-size: 1.1rem;
          color: #6c757d;
        }

        .contact-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .contact-info-section {
          animation: fadeInLeft 0.6s ease-out;
        }

        .contact-form-section {
          animation: fadeInRight 0.6s ease-out;
        }

        .section-card {
          background: white;
          border-rad ius: 0.1vmin solid black;
          padding: 35px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .section-title {
          font-size: 1.5rem;
          color: #003d5c;
          margin-bottom: 25px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 25px;
          padding: 15px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .info-item:hover {
          background: #f8f9fa;
          transform: translateX(5px);
        }

        .info-icon {
          width: 45px;
          height: 45px;
          background: linear-gradient(135deg, #003d5c 0%, #004d73 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        .info-content h3 {
          font-size: 1.1rem;
          color: #003d5c;
          margin-bottom: 5px;
          font-weight: 600;
        }

        .info-content p {
          color: #6c757d;
          line-height: 1.6;
        }

        .info-content a {
          color: #F4991A;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .info-content a:hover {
          color: #e08810;
          text-decoration: underline;
        }

        .quick-actions {
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #f0f0f0;
        }

        .quick-actions h3 {
          font-size: 1.2rem;
          color: #003d5c;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .btn {
          padding: 15px 25px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 1rem;
          border: none;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn:hover::before {
          width: 300%;
          height: 300%;
        }

        .btn span {
          position: relative;
          z-index: 1;
        }

        .primary-btn {
          background: linear-gradient(135deg, #003d5c 0%, #004d73 100%);
          color: white;
          box-shadow: 0 4px 16px rgba(0, 61, 92, 0.3);
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(0, 61, 92, 0.4);
        }

        .secondary-btn {
          background: white;
          color: #F4991A;
          border: 2px solid #F4991A;
        }

        .secondary-btn:hover {
          background: #F4991A;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 4px 16px rgba(244, 153, 26, 0.3);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #003d5c;
          font-size: 0.95rem;
        }

        .required {
          color: #ef4444;
          margin-left: 3px;
        }

        .form-group input,
        .form-group textarea {
          padding: 14px 16px;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #003d5c;
          box-shadow: 0 0 0 4px rgba(0, 61, 92, 0.1);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.85rem;
          margin-top: -5px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #F4991A 0%, #e08810 100%);
          color: white;
          padding: 16px 32px;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(244, 153, 26, 0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(244, 153, 26, 0.4);
        }

        .submit-btn:disabled {
          background: #adb5bd;
          cursor: not-allowed;
          transform: none;
        }

        .success-message {
          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
          color: #155724;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          animation: slideDown 0.4s ease-out;
          border: 2px solid #28a745;
        }

        .map-section {
          animation: fadeInUp 0.6s ease-out;
        }

        .map-container {
          background: white;
          border-radius: 16px;
          padding: 35px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .map-placeholder {
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: #6c757d;
          flex-direction: column;
          gap: 15px;
        }

        .map-placeholder-icon {
          font-size: 3rem;
        }

        .map-iframe {
          width: 100%;
          height: 450px;
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Large Tablets and Small Laptops (1024px - 1200px) */
        @media (max-width: 1200px) {
          .contact-page {
            max-width: 1000px;
            padding: 35px 20px;
          }

          .page-header h1 {
            font-size: 2.2rem;
          }

          .section-card {
            padding: 30px;
          }
        }

        /* Tablets Portrait (768px - 1024px) */
        @media (max-width: 1024px) {
          .contact-page {
            padding: 30px 20px;
          }

          .page-header {
            margin-bottom: 40px;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .page-header p {
            font-size: 1rem;
          }

          .contact-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .section-card {
            padding: 28px;
            margin-left: 0;
          }

          .map-iframe {
            height: 400px;
          }
        }

        /* Small Tablets (600px - 768px) */
        @media (max-width: 768px) {
          .contact-page {
            padding: 25px 18px;
          }

          .page-header h1 {
            font-size: 1.85rem;
          }

          .page-header p {
            font-size: 0.95rem;
          }

          .section-card {
            padding: 25px;
            margin-left: 0;
          }

          .section-title {
            font-size: 1.35rem;
          }

          .info-item {
            padding: 12px;
            margin-bottom: 20px;
          }

          .info-icon {
            width: 42px;
            height: 42px;
            font-size: 1.2rem;
          }

          .info-content h3 {
            font-size: 1rem;
          }

          .info-content p {
            font-size: 0.9rem;
          }

          .btn {
            padding: 14px 22px;
            font-size: 0.95rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 12px 14px;
            font-size: 0.95rem;
          }

          .submit-btn {
            padding: 14px 28px;
            font-size: 1rem;
          }

          .map-iframe {
            height: 350px;
          }

          .map-container {
            padding: 28px;
          }
        }

        /* Large Phones (480px - 600px) */
        @media (max-width: 600px) {
          .contact-page {
            padding: 20px 15px;
          }

          .page-header {
            margin-bottom: 35px;
          }

          .page-header h1 {
            font-size: 1.65rem;
            line-height: 1.3;
          }

          .page-header p {
            font-size: 0.9rem;
          }

          .contact-content {
            gap: 25px;
          }

          .section-card {
            padding: 22px;
            border-radius: 14px;
          }

          .section-title {
            font-size: 1.25rem;
            margin-bottom: 20px;
          }

          .info-item {
            padding: 10px;
            margin-bottom: 18px;
            gap: 12px;
          }

          .info-icon {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }

          .info-content h3 {
            font-size: 0.95rem;
          }

          .info-content p {
            font-size: 0.85rem;
          }

          .quick-actions {
            margin-top: 25px;
            padding-top: 25px;
          }

          .quick-actions h3 {
            font-size: 1.1rem;
            margin-bottom: 15px;
          }

          .action-buttons {
            gap: 12px;
          }

          .btn {
            padding: 13px 20px;
            font-size: 0.9rem;
            gap: 8px;
          }

          .contact-form {
            gap: 18px;
          }

          .form-group {
            gap: 6px;
          }

          .form-group label {
            font-size: 0.9rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 12px 14px;
            font-size: 0.9rem;
          }

          .form-group textarea {
            min-height: 100px;
          }

          .submit-btn {
            padding: 14px 26px;
            font-size: 1rem;
          }

          .success-message {
            padding: 14px 18px;
            font-size: 0.9rem;
          }

          .map-container {
            padding: 22px;
          }

          .map-iframe {
            height: 300px;
          }
        }

        /* Small Phones (320px - 480px) */
        @media (max-width: 480px) {
          .contact-page {
            padding: 18px 12px;
          }

          .page-header {
            margin-bottom: 30px;
          }

          .page-header h1 {
            font-size: 1.5rem;
            line-height: 1.25;
          }

          .page-header p {
            font-size: 0.85rem;
            line-height: 1.4;
          }

          .contact-content {
            gap: 20px;
            margin-bottom: 30px;
          }

          .section-card {
            padding: 18px;
            border-radius: 12px;
          }

          .section-title {
            font-size: 1.15rem;
            margin-bottom: 18px;
            gap: 8px;
          }

          .info-item {
            padding: 8px;
            margin-bottom: 15px;
            gap: 10px;
            flex-direction: row;
          }

          .info-item:hover {
            transform: translateX(3px);
          }

          .info-icon {
            width: 36px;
            height: 36px;
            font-size: 1rem;
            border-radius: 10px;
          }

          .info-content h3 {
            font-size: 0.9rem;
            margin-bottom: 4px;
          }

          .info-content p {
            font-size: 0.8rem;
            line-height: 1.5;
          }

          .quick-actions {
            margin-top: 20px;
            padding-top: 20px;
          }

          .quick-actions h3 {
            font-size: 1rem;
            margin-bottom: 12px;
          }

          .action-buttons {
            gap: 10px;
          }

          .btn {
            padding: 12px 18px;
            font-size: 0.85rem;
            gap: 6px;
            border-radius: 10px;
          }

          .contact-form {
            gap: 15px;
          }

          .form-group {
            gap: 5px;
          }

          .form-group label {
            font-size: 0.85rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 11px 13px;
            font-size: 0.85rem;
            border-radius: 8px;
          }

          .form-group textarea {
            min-height: 90px;
          }

          .submit-btn {
            padding: 13px 24px;
            font-size: 0.95rem;
            border-radius: 10px;
          }

          .error-message {
            font-size: 0.8rem;
          }

          .success-message {
            padding: 12px 16px;
            font-size: 0.85rem;
            gap: 10px;
            border-radius: 10px;
          }

          .map-section {
            margin-top: 20px;
          }

          .map-container {
            padding: 18px;
            border-radius: 14px;
          }

          .map-iframe {
            height: 280px;
            border-radius: 10px;
          }
        }

        /* Extra Small Phones (< 360px) */
        @media (max-width: 360px) {
          .contact-page {
            padding: 15px 10px;
          }

          .page-header h1 {
            font-size: 1.35rem;
          }

          .page-header p {
            font-size: 0.8rem;
          }

          .section-card {
            padding: 15px;
          }

          .section-title {
            font-size: 1.05rem;
          }

          .info-icon {
            width: 34px;
            height: 34px;
            font-size: 0.95rem;
          }

          .info-content h3 {
            font-size: 0.85rem;
          }

          .info-content p {
            font-size: 0.75rem;
          }

          .btn {
            padding: 11px 16px;
            font-size: 0.8rem;
          }

          .form-group input,
          .form-group textarea {
            padding: 10px 12px;
            font-size: 0.8rem;
          }

          .submit-btn {
            padding: 12px 20px;
            font-size: 0.9rem;
          }

          .map-iframe {
            height: 250px;
          }

          .map-container {
            padding: 15px;
          }
        }
      `}</style> <style>{`
                        * {
                          margin: 0;
                          padding: 0;
                          box-sizing: border-box;
                        }

                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                          min-height: 100vh;
                        }

                        .contact-page {
                          max-width: 1200px;
                          margin: 0 auto;
                          padding: 40px 20px;
                        }

                        .page-header {
                          text-align: center;
                          margin-bottom: 50px;
                          animation: fadeInDown 0.6s ease-out;
                        }

                        .page-header h1 {
                          font-size: 2.5rem;
                          color: #003d5c;
                          margin-bottom: 10px;
                          font-weight: 700;
                        }

                        .page-header p {
                          font-size: 1.1rem;
                          color: #6c757d;
                        }

                        .contact-content {
                          display: grid;
                          grid-template-columns: 1fr 1fr;
                          gap: 40px;
                          margin-bottom: 50px;
                        }

                        .contact-info-section {
                          animation: fadeInLeft 0.6s ease-out;
                        }

                        .contact-form-section {
                          animation: fadeInRight 0.6s ease-out;
                        }

                        .section-card {
                          background: white;
                          border-radius: 16px;
                          padding: 35px;
                          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                          height: 100%;
                        }

                        .section-title {
                          font-size: 1.5rem;
                          color: #003d5c;
                          margin-bottom: 25px;
                          font-weight: 700;
                          display: flex;
                          align-items: center;
                          gap: 10px;
                        }

                        .info-item {
                          display: flex;
                          align-items: flex-start;
                          gap: 15px;
                          margin-bottom: 25px;
                          padding: 15px;
                          border-radius: 12px;
                          transition: all 0.3s ease;
                        }

                        .info-item:hover {
                          background: #f8f9fa;
                          transform: translateX(5px);
                        }

                        .info-icon {
                          width: 45px;
                          height: 45px;
                          background: linear-gradient(135deg, #003d5c 0%, #004d73 100%);
                          border-radius: 12px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 1.3rem;
                          flex-shrink: 0;
                        }

                        .info-content h3 {
                          font-size: 1.1rem;
                          color: #003d5c;
                          margin-bottom: 5px;
                          font-weight: 600;
                        }

                        .info-content p {
                          color: #6c757d;
                          line-height: 1.6;
                        }

                        .info-content a {
                          color: #F4991A;
                          text-decoration: none;
                          font-weight: 500;
                          transition: color 0.3s ease;
                        }

                        .info-content a:hover {
                          color: #e08810;
                          text-decoration: underline;
                        }

                        .quick-actions {
                          margin-top: 30px;
                          padding-top: 30px;
                          border-top: 2px solid #f0f0f0;
                        }

                        .quick-actions h3 {
                          font-size: 1.2rem;
                          color: #003d5c;
                          margin-bottom: 20px;
                          font-weight: 600;
                        }

                        .action-buttons {
                          display: flex;
                          flex-direction: column;
                          gap: 15px;
                        }

                        .btn {
                          padding: 15px 25px;
                          border-radius: 12px;
                          text-decoration: none;
                          font-weight: 600;
                          transition: all 0.3s ease;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          gap: 10px;
                          font-size: 1rem;
                          border: none;
                          position: relative;
                          overflow: hidden;
                        }

                        .btn::before {
                          content: '';
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          width: 0;
                          height: 0;
                          border-radius: 50%;
                          background: rgba(255, 255, 255, 0.3);
                          transform: translate(-50%, -50%);
                          transition: width 0.6s, height 0.6s;
                        }

                        .btn:hover::before {
                          width: 300%;
                          height: 300%;
                        }

                        .btn span {
                          position: relative;
                          z-index: 1;
                        }

                        .primary-btn {
                          background: linear-gradient(135deg, #003d5c 0%, #004d73 100%);
                          color: white;
                          box-shadow: 0 4px 16px rgba(0, 61, 92, 0.3);
                        }

                        .primary-btn:hover {
                          transform: translateY(-3px);
                          box-shadow: 0 6px 24px rgba(0, 61, 92, 0.4);
                        }

                        .secondary-btn {
                          background: white;
                          color: #F4991A;
                          border: 2px solid #F4991A;
                        }

                        .secondary-btn:hover {
                          background: #F4991A;
                          color: white;
                          transform: translateY(-3px);
                          box-shadow: 0 4px 16px rgba(244, 153, 26, 0.3);
                        }

                        .contact-form {
                          display: flex;
                          flex-direction: column;
                          gap: 20px;
                        }

                        .form-group {
                          display: flex;
                          flex-direction: column;
                          gap: 8px;
                        }

                        .form-group label {
                          font-weight: 600;
                          color: #003d5c;
                          font-size: 0.95rem;
                        }

                        .required {
                          color: #ef4444;
                          margin-left: 3px;
                        }

                        .form-group input,
                        .form-group textarea {
                          padding: 14px 16px;
                          border: 2px solid #dee2e6;
                          border-radius: 10px;
                          font-size: 1rem;
                          transition: all 0.3s ease;
                          font-family: inherit;
                        }

                        .form-group textarea {
                          resize: vertical;
                          min-height: 120px;
                        }

                        .form-group input:focus,
                        .form-group textarea:focus {
                          outline: none;
                          border-color: #003d5c;
                          box-shadow: 0 0 0 4px rgba(0, 61, 92, 0.1);
                        }

                        .form-group input.error,
                        .form-group textarea.error {
                          border-color: #ef4444;
                        }

                        .error-message {
                          color: #ef4444;
                          font-size: 0.85rem;
                          margin-top: -5px;
                        }

                        .submit-btn {
                          background: linear-gradient(135deg, #F4991A 0%, #e08810 100%);
                          color: white;
                          padding: 16px 32px;
                          border: none;
                          border-radius: 12px;
                          font-size: 1.1rem;
                          font-weight: 700;
                          cursor: pointer;
                          transition: all 0.3s ease;
                          box-shadow: 0 4px 16px rgba(244, 153, 26, 0.3);
                          position: relative;
                          overflow: hidden;
                        }

                        .submit-btn:hover:not(:disabled) {
                          transform: translateY(-3px);
                          box-shadow: 0 6px 24px rgba(244, 153, 26, 0.4);
                        }

                        .submit-btn:disabled {
                          background: #adb5bd;
                          cursor: not-allowed;
                          transform: none;
                        }

                        .success-message {
                          background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                          color: #155724;
                          padding: 16px 20px;
                          border-radius: 12px;
                          margin-bottom: 20px;
                          display: flex;
                          align-items: center;
                          gap: 12px;
                          font-weight: 600;
                          animation: slideDown 0.4s ease-out;
                          border: 2px solid #28a745;
                        }

                        .map-section {
                          animation: fadeInUp 0.6s ease-out;
                        }

                        .map-container {
                          background: white;
                          border-radius: 16px;
                          padding: 35px;
                          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                        }

                        .map-placeholder {
                          width: 100%;
                          height: 400px;
                          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
                          border-radius: 12px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 1.1rem;
                          color: #6c757d;
                          flex-direction: column;
                          gap: 15px;
                        }

                        .map-placeholder-icon {
                          font-size: 3rem;
                        }

                        .map-iframe {
                          width: 100%;
                          height: 450px;
                          border: none;
                          border-radius: 12px;
                          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        }

                        @keyframes fadeInDown {
                          from {
                            opacity: 0;
                            transform: translateY(-30px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }

                        @keyframes fadeInLeft {
                          from {
                            opacity: 0;
                            transform: translateX(-30px);
                          }
                          to {
                            opacity: 1;
                            transform: translateX(0);
                          }
                        }

                        @keyframes fadeInRight {
                          from {
                            opacity: 0;
                            transform: translateX(30px);
                          }
                          to {
                            opacity: 1;
                            transform: translateX(0);
                          }
                        }

                        @keyframes fadeInUp {
                          from {
                            opacity: 0;
                            transform: translateY(30px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }

                        @keyframes slideDown {
                          from {
                            opacity: 0;
                            transform: translateY(-20px);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                          }
                        }

                        /* Large Tablets and Small Laptops (1024px - 1200px) */
                        @media (max-width: 1200px) {
                          .contact-page {
                            max-width: 1000px;
                            padding: 35px 20px;
                          }

                          .page-header h1 {
                            font-size: 2.2rem;
                          }

                          .section-card {
                            padding: 30px;
                          }
                        }

                        /* Tablets Portrait (768px - 1024px) */
                        @media (max-width: 1024px) {
                          .contact-page {
                            padding: 30px 20px;
                          }

                          .page-header {
                            margin-bottom: 40px;
                          }

                          .page-header h1 {
                            font-size: 2rem;
                          }

                          .page-header p {
                            font-size: 1rem;
                          }

                          .contact-content {
                            grid-template-columns: 1fr;
                            gap: 30px;
                          }

                          .section-card {
                            padding: 28px;
                            margin-left: 0;
                          }

                          .map-iframe {
                            height: 400px;
                          }
                        }

                        /* Small Tablets (600px - 768px) */
                        @media (max-width: 768px) {
                          .contact-page {
                            padding: 25px 18px;
                          }

                          .page-header h1 {
                            font-size: 1.85rem;
                          }

                          .page-header p {
                            font-size: 0.95rem;
                          }

                          .section-card {
                            padding: 25px;
                            margin-left: 0;
                          }

                          .section-title {
                            font-size: 1.35rem;
                          }

                          .info-item {
                            padding: 12px;
                            margin-bottom: 20px;
                          }

                          .info-icon {
                            width: 42px;
                            height: 42px;
                            font-size: 1.2rem;
                          }

                          .info-content h3 {
                            font-size: 1rem;
                          }

                          .info-content p {
                            font-size: 0.9rem;
                          }

                          .btn {
                            padding: 14px 22px;
                            font-size: 0.95rem;
                          }

                          .form-group input,
                          .form-group textarea {
                            padding: 12px 14px;
                            font-size: 0.95rem;
                          }

                          .submit-btn {
                            padding: 14px 28px;
                            font-size: 1rem;
                          }

                          .map-iframe {
                            height: 350px;
                          }

                          .map-container {
                            padding: 28px;
                          }
                        }

                        /* Large Phones (480px - 600px) */
                        @media (max-width: 600px) {
                          .contact-page {
                            padding: 20px 15px;
                          }

                          .page-header {
                            margin-bottom: 35px;
                          }

                          .page-header h1 {
                            font-size: 1.65rem;
                            line-height: 1.3;
                          }

                          .page-header p {
                            font-size: 0.9rem;
                          }

                          .contact-content {
                            gap: 25px;
                          }

                          .section-card {
                            padding: 22px;
                            border-radius: 14px;
                          }

                          .section-title {
                            font-size: 1.25rem;
                            margin-bottom: 20px;
                          }

                          .info-item {
                            padding: 10px;
                            margin-bottom: 18px;
                            gap: 12px;
                          }

                          .info-icon {
                            width: 40px;
                            height: 40px;
                            font-size: 1.1rem;
                          }

                          .info-content h3 {
                            font-size: 0.95rem;
                          }

                          .info-content p {
                            font-size: 0.85rem;
                          }

                          .quick-actions {
                            margin-top: 25px;
                            padding-top: 25px;
                          }

                          .quick-actions h3 {
                            font-size: 1.1rem;
                            margin-bottom: 15px;
                          }

                          .action-buttons {
                            gap: 12px;
                          }

                          .btn {
                            padding: 13px 20px;
                            font-size: 0.9rem;
                            gap: 8px;
                          }

                          .contact-form {
                            gap: 18px;
                          }

                          .form-group {
                            gap: 6px;
                          }

                          .form-group label {
                            font-size: 0.9rem;
                          }

                          .form-group input,
                          .form-group textarea {
                            padding: 12px 14px;
                            font-size: 0.9rem;
                          }

                          .form-group textarea {
                            min-height: 100px;
                          }

                          .submit-btn {
                            padding: 14px 26px;
                            font-size: 1rem;
                          }

                          .success-message {
                            padding: 14px 18px;
                            font-size: 0.9rem;
                          }

                          .map-container {
                            padding: 22px;
                          }

                          .map-iframe {
                            height: 300px;
                          }
                        }

                        /* Small Phones (320px - 480px) */
                        @media (max-width: 480px) {
                          .contact-page {
                            padding: 18px 12px;
                          }

                          .page-header {
                            margin-bottom: 30px;
                          }

                          .page-header h1 {
                            font-size: 1.5rem;
                            line-height: 1.25;
                          }

                          .page-header p {
                            font-size: 0.85rem;
                            line-height: 1.4;
                          }

                          .contact-content {
                            gap: 20px;
                            margin-bottom: 30px;
                          }

                          .section-card {
                            padding: 18px;
                            border-radius: 12px;
                          }

                          .section-title {
                            font-size: 1.15rem;
                            margin-bottom: 18px;
                            gap: 8px;
                          }

                          .info-item {
                            padding: 8px;
                            margin-bottom: 15px;
                            gap: 10px;
                            flex-direction: row;
                          }

                          .info-item:hover {
                            transform: translateX(3px);
                          }

                          .info-icon {
                            width: 36px;
                            height: 36px;
                            font-size: 1rem;
                            border-radius: 10px;
                          }

                          .info-content h3 {
                            font-size: 0.9rem;
                            margin-bottom: 4px;
                          }

                          .info-content p {
                            font-size: 0.8rem;
                            line-height: 1.5;
                          }

                          .quick-actions {
                            margin-top: 20px;
                            padding-top: 20px;
                          }

                          .quick-actions h3 {
                            font-size: 1rem;
                            margin-bottom: 12px;
                          }

                          .action-buttons {
                            gap: 10px;
                          }

                          .btn {
                            padding: 12px 18px;
                            font-size: 0.85rem;
                            gap: 6px;
                            border-radius: 10px;
                          }

                          .contact-form {
                            gap: 15px;
                          }

                          .form-group {
                            gap: 5px;
                          }

                          .form-group label {
                            font-size: 0.85rem;
                          }

                          .form-group input,
                          .form-group textarea {
                            padding: 11px 13px;
                            font-size: 0.85rem;
                            border-radius: 8px;
                          }

                          .form-group textarea {
                            min-height: 90px;
                          }

                          .submit-btn {
                            padding: 13px 24px;
                            font-size: 0.95rem;
                            border-radius: 10px;
                          }

                          .error-message {
                            font-size: 0.8rem;
                          }

                          .success-message {
                            padding: 12px 16px;
                            font-size: 0.85rem;
                            gap: 10px;
                            border-radius: 10px;
                          }

                          .map-section {
                            margin-top: 20px;
                          }

                          .map-container {
                            padding: 18px;
                            border-radius: 14px;
                          }

                          .map-iframe {
                            height: 280px;
                            border-radius: 10px;
                          }
                        }

                        /* Extra Small Phones (< 360px) */
                        @media (max-width: 360px) {
                          .contact-page {
                            padding: 15px 10px;
                          }

                          .page-header h1 {
                            font-size: 1.35rem;
                          }

                          .page-header p {
                            font-size: 0.8rem;
                          }

                          .section-card {
                            padding: 15px;
                          }

                          .section-title {
                            font-size: 1.05rem;
                          }

                          .info-icon {
                            width: 34px;
                            height: 34px;
                            font-size: 0.95rem;
                          }

                          .info-content h3 {
                            font-size: 0.85rem;
                          }

                          .info-content p {
                            font-size: 0.75rem;
                          }

                          .btn {
                            padding: 11px 16px;
                            font-size: 0.8rem;
                          }

                          .form-group input,
                          .form-group textarea {
                            padding: 10px 12px;
                            font-size: 0.8rem;
                          }

                          .submit-btn {
                            padding: 12px 20px;
                            font-size: 0.9rem;
                          }

                          .map-iframe {
                            height: 250px;
                          }

                          .map-container {
                            padding: 15px;
                          }
                        }
                      `}</style>

      <div className="contact-page">
        <div className="page-header">
          <h1>📞 Get in Touch with Us</h1>
          <p>We're here to help you with your educational journey</p>
        </div>

        <div className="contact-content">
          {/* Contact Information Section */}
          <div className="contact-info-section">
            <div className="section-card">
              <h2 className="section-title">
                <span>📍</span> Contact Information
              </h2>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p>
                    <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                  </p>
                  <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    Monday to Saturday (9.30 a.m. to 5.30 p.m.)
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                  <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h3>Address</h3>
                  <p>{address}</p>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <a href={`tel:${phoneNumber}`} className="btn primary-btn">
                    <span>📞</span>
                    <span>Call Us Now</span>
                  </a>
                  <a href={`mailto:${email}`} className="btn secondary-btn">
                    <span>✉️</span>
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="contact-form-section">
            <div className="section-card">
              <h2 className="section-title">
                <span>📝</span> Send Us a Message
              </h2>

              {submitSuccess && (
                <div className="success-message">
                  <span style={{ fontSize: '1.5rem' }}>✓</span>
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              )}

              <div className="contact-form">
                <div className="form-group">
                  <label>
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label>
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    className={errors.mobileNo ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.mobileNo}</span>}
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label>
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className={errors.message ? 'error' : ''}
                  />
                  {errors.message && <span className="error-message">{errors.message}</span>}
                </div>

                <button
                  onClick={handleSubmit}
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message 🚀'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
               <div className="map-section">
                 <div className="map-container">
                   <h2 className="section-title">
                     <span>🗺️</span> Find Us Here
                   </h2>
                   <iframe
                     src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3119.2682039848037!2d73.88100887416788!3d18.460318371014026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2eaf42e26fa71%3A0x2a9a1928beae9eec!2sVishwakarma%20University!5e1!3m2!1sen!2sin!4v1764152683993!5m2!1sen!2sin"}
                     className="map-iframe"
                     allowFullScreen
                     loading="lazy"
                     referrerPolicy="no-referrer-when-downgrade"
                     title="EDUPlus Campus Location"
                   ></iframe>
                   <div style={{ marginTop: '15px', textAlign: 'center', color: '#6c757d', fontSize: '0.95rem' }}>
                     📍 {address}
                   </div>
                 </div>
               </div>
             </div>
           </>
         );
       }