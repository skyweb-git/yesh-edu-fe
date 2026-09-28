import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Scale, CreditCard, HelpCircle, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50/50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 font-semibold text-sm hover:bg-stone-100 hover:text-stone-900 transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </motion.div>
        
        {/* Top Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200/80 shadow-sm text-center relative overflow-hidden mb-10"
        >
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-red-600 via-stone-800 to-red-600"></div>
          
          <div className="w-16 h-16 bg-red-50 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Scale className="w-8 h-8" />
          </div>

          <span className="px-4 py-1.5 bg-red-50 text-[var(--color-primary)] rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Official Policy Document
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-4">
            Financial Terms & Conditions
          </h1>

          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            These Financial Terms & Conditions govern all payments, fees, enrolments, refunds, cancellations, discounts, and other financial transactions relating to courses, tuition programmes, classes, study materials, and educational services provided by <strong className="text-stone-900 font-semibold">Yash Educational Institute</strong> (“Institute”, “we”, “us”, or “our”).
          </p>

          <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-center gap-2 text-xs font-semibold text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Effective Date: 27 August 2026</span>
            <span className="mx-2">•</span>
            <span>Applicable Law: India</span>
          </div>
        </motion.div>

        {/* Content Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-sm space-y-8 text-stone-800 leading-relaxed text-sm sm:text-base"
        >
          <div className="p-4 bg-amber-50/80 border border-amber-200/70 rounded-2xl flex items-start gap-3.5 text-amber-900 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              By enrolling in any programme or making any payment, the student and/or parent/guardian (“Student”) acknowledges and agrees to these terms.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">1</span>
              Course Fees
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>All course fees shall be communicated to the Student before enrolment.</li>
              <li>The applicable fee shall be the fee displayed or officially communicated by the Institute at the time of enrolment.</li>
              <li>Fees must be paid within the payment period specified by the Institute.</li>
              <li>The Institute reserves the right to revise fees for future admissions, batches, courses, or academic sessions.</li>
              <li>Any fee revision shall not retrospectively change the agreed fee for a currently enrolled course unless otherwise permitted by the applicable agreement or law.</li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">2</span>
              Payment Responsibility
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>The Student or parent/guardian is solely responsible for ensuring that all applicable fees are paid on time.</li>
              <li>Payment obligations are not automatically cancelled because of absence from classes, holidays, personal circumstances, change of schedule, or failure to attend classes.</li>
              <li>Non-attendance does not by itself constitute cancellation of enrolment.</li>
              <li>The Institute may restrict access to classes, course materials, assessments, or other services where an amount has become due and remains unpaid, subject to applicable law and the terms communicated at enrolment.</li>
              <li>Any outstanding amount shall remain payable until formally settled or otherwise adjusted by the Institute.</li>
            </ol>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">3</span>
              Instalment Payments
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>Where an instalment facility is offered, each instalment must be paid on or before its specified due date.</li>
              <li>An instalment arrangement does not change the total course fee unless expressly confirmed in writing by the Institute.</li>
              <li>Failure to pay an instalment may result in suspension of access to the relevant educational services until the outstanding amount is cleared.</li>
              <li>The Institute may require outstanding instalments to be cleared before permitting continued participation in the programme.</li>
            </ol>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">4</span>
              Late Payments
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>Payments received after the applicable due date may be subject to a reasonable late-payment charge where such charge has been disclosed before enrolment.</li>
              <li>Repeated or prolonged payment defaults may result in suspension or cancellation of enrolment, subject to applicable law.</li>
              <li>Any applicable late fee shall be separately communicated and shall not be imposed without prior disclosure.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">5</span>
              Refund Policy
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>Refund eligibility shall depend on the course, enrolment terms, cancellation date, services already provided, and applicable law.</li>
              <li>A blanket statement that <strong>“fees are never refundable under any circumstances”</strong> shall not apply where a refund is required by applicable law or where the Institute's own refund policy provides otherwise.</li>
              <li>If a refund is approved, the refundable amount may be calculated after deducting amounts legitimately attributable to services already provided, non-refundable items expressly disclosed before enrolment, or other permitted charges.</li>
              <li>Registration fees, admission charges, examination fees, study-material charges, or other specific charges shall be refundable only where the applicable written policy states that they are refundable or where required by law.</li>
              <li>Refund requests must be submitted through the Institute's officially designated process.</li>
              <li>The Institute may request supporting documents where a refund request is based on a specific circumstance.</li>
              <li>Approved refunds shall normally be processed through the original payment method unless another method is legally or operationally appropriate.</li>
              <li>The Institute will not make deductions that are prohibited by applicable law.</li>
            </ol>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">6</span>
              Cancellation by Student
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>A request to cancel enrolment must be submitted through the officially designated cancellation procedure.</li>
              <li>Cancellation shall not automatically result in a full refund.</li>
              <li>The final refund, if any, shall be determined according to the applicable course refund policy and applicable law.</li>
              <li>Verbal requests, messages to individual teachers, or failure to attend classes shall not by themselves constitute formal cancellation.</li>
            </ol>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">7</span>
              Course Withdrawal
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>A Student who voluntarily stops attending classes remains subject to the financial terms applicable to the enrolled programme.</li>
              <li>Simply discontinuing attendance does not automatically terminate payment obligations.</li>
              <li>Where the Institute's refund/withdrawal policy permits withdrawal, the Student must complete the prescribed withdrawal process.</li>
            </ol>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">8</span>
              Discounts and Promotional Offers
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>Discounts, scholarships, promotional offers, and fee concessions are valid only for the period and conditions specified by the Institute.</li>
              <li>Promotional discounts cannot be combined unless expressly permitted.</li>
              <li>A discount may not be applied retrospectively to a payment already completed unless the Institute expressly approves such adjustment.</li>
              <li>The Institute reserves the right to withdraw or modify promotional offers for future enrolments, subject to applicable law.</li>
            </ol>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">9</span>
              Taxes and Statutory Charges
            </h2>
            <p className="text-stone-700">
              Any applicable taxes, government charges, payment-processing charges, or statutory levies shall be charged in accordance with applicable law and shall be disclosed where required.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">10</span>
              Payment Gateway / Bank Charges
            </h2>
            <p className="text-stone-700">
              Where a payment gateway, bank, card provider, or other third-party payment service charges a transaction fee, the treatment of such charge shall be as disclosed during payment. The Institute shall not be responsible for charges independently imposed by a student's bank or payment provider.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">11</span>
              Failed or Reversed Transactions
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>If a payment is shown as successful by the Student but is not received by the Institute, the Student may be required to provide the transaction reference for verification.</li>
              <li>A payment shall be considered received only after successful confirmation by the Institute or its authorised payment processor.</li>
              <li>Where a payment is reversed, charged back, or dishonoured, the corresponding outstanding amount may become payable again.</li>
              <li>The Institute reserves the right to suspend access until payment discrepancies are resolved.</li>
            </ol>
          </section>

          {/* Section 12 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">12</span>
              Chargebacks and Payment Disputes
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-stone-700">
              <li>Students should first contact the Institute to resolve genuine payment disputes.</li>
              <li>A chargeback or payment dispute should not be initiated fraudulently or for the purpose of avoiding a valid payment obligation.</li>
              <li>If a payment is legitimately reversed by a bank or payment provider, the Institute may request settlement of any amount that remains lawfully due.</li>
            </ol>
          </section>

          {/* Section 13 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">13</span>
              No Guaranteed Financial or Academic Outcome
            </h2>
            <p className="text-stone-700">
              Payment of course fees provides access to the educational services included in the enrolled programme. It does <strong>not</strong> constitute a guarantee of marks, examination results, admission, rank, selection, employment, or any other particular outcome.
            </p>
            <p className="text-stone-700">
              The Institute shall not advertise or represent guaranteed results unless such representation is lawful, accurate, substantiated, and applicable to the particular programme.
            </p>
          </section>

          {/* Section 14 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">14</span>
              Course Changes or Institute Cancellation
            </h2>
            <p className="text-stone-700">
              If the Institute cancels, substantially changes, or is unable to provide a course or service for which payment has been made, the Institute shall provide the applicable remedy, transfer option, credit, or refund in accordance with its published policy and applicable law.
            </p>
          </section>

          {/* Section 15 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">15</span>
              Third-Party Payments
            </h2>
            <p className="text-stone-700">
              Where a Student uses a third-party payment provider, bank, wallet, UPI service, card provider, or financing service, the Student may also be subject to that provider's terms and conditions.
            </p>
            <p className="text-stone-700">
              The Institute is not responsible for delays or failures caused solely by a third-party payment provider.
            </p>
          </section>

          {/* Section 16 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">16</span>
              Receipts and Proof of Payment
            </h2>
            <p className="text-stone-700">
              Students should retain payment receipts, transaction IDs, invoices, and other payment confirmations for their records.
            </p>
            <p className="text-stone-700">
              The Institute may require proof of payment when investigating payment discrepancies or refund requests.
            </p>
          </section>

          {/* Section 17 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">17</span>
              Misrepresentation and Fraudulent Transactions
            </h2>
            <p className="text-stone-700">
              The Institute reserves the right to investigate suspected fraudulent payments, falsified payment confirmations, unauthorised transactions, or deliberate misrepresentation relating to fees.
            </p>
            <p className="text-stone-700">
              Where permitted by law, access to services may be suspended while such matters are investigated.
            </p>
          </section>

          {/* Section 18 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">18</span>
              Changes to Financial Terms
            </h2>
            <p className="text-stone-700">
              The Institute may update these Financial Terms & Conditions from time to time. Updated terms shall apply to future enrolments and transactions from the stated effective date, subject to applicable law and any existing contractual rights.
            </p>
          </section>

          {/* Section 19 */}
          <section className="space-y-3 pb-6 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">19</span>
              Governing Law
            </h2>
            <p className="text-stone-700">
              These Financial Terms & Conditions shall be governed by the laws applicable in India.
            </p>
            <p className="text-stone-700">
              Any dispute shall be handled through the appropriate legal or consumer forum having jurisdiction under applicable law.
            </p>
          </section>

          {/* Section 20 */}
          <section className="space-y-3 pt-2">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-red-100 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">20</span>
              Acceptance of Financial Terms
            </h2>
            <p className="text-stone-700">
              By completing enrolment, submitting an admission form, accepting a course offer, or making payment for a programme, the Student and/or parent/guardian confirms that they have had an opportunity to review the applicable financial terms and agree to comply with them.
            </p>
            <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-900 font-bold text-center text-sm">
              Yash Educational Institute reserves all rights available to it under applicable law.
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
};
