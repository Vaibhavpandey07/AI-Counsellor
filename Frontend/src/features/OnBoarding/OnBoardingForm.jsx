import { useEffect, useState } from "react";
import heroBackground from "../../assets/img/hero/hero-bg_new.jpg";
import UserCard from "./UserCard";
import { AuroraBackground } from "../../components/layout/AuroraBackground";
import api from "../../api/axios";
import { replace, useNavigate } from "react-router-dom";

let YEARS = Array.from({ length: 2026 - 1980 + 1 }, (_, i) => 1980 + i);
YEARS.reverse()
const EXAMS = ["GRE", "GMAT", "IELTS", "TOEFL"];

const DEGREE_FIELDS = {
  Bachelors: ["Computer Science", "Business", "Engineering", "Arts", "Science"],
  Masters: ["Computer Science", "MBA", "Data Science", "Engineering"],
  PhD: ["Computer Science", "Management", "Engineering"],
};

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
  "Netherlands",
  "Ireland",

];

export default function OnBoardingForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    educationLevel: "",
    educationField: "",
    year: "",
    marks:"",
    degree: "",
    degreeField: "",
    intake: "",
    intakeYear :"",
    budget: "",
    countries: [],
    scholarship: "no",
    fundingPlan:"",
    exam: "",
    score: "",
    extraExam: "",
  });

  const navigate = useNavigate();
  const addCountry = (c) => {
    if (!form.countries.includes(c)) {
      setForm({ ...form, countries: [...form.countries, c] });
    }
  };

  const removeCountry = (c) => {
    setForm({ ...form, countries: form.countries.filter((x) => x !== c) });
  };

  const onSubmit = async()=>{
    if(form.educationLevel && form.educationField && form.year && form.degree && form.degreeField && form.intake && form.intakeYear && form.budget && form.fundingPlan ){
      
      const dataToSave = {
        currentEducationLevel : form.educationLevel,
        major : form.educationField,
        yearOfGraduation : form.year,
        marks : form.marks,
        
        degreeToAchieve : form.degree,
        degreeField : form.degreeField,
        intake : form.intake,
        intakeYear : form.intakeYear,
        
        budget : form.budget,
        targetCountries :  form.countries,
        fundingPlan : form.fundingPlan,
        haveScholarship : form.scholarship,
        
        examGiven : form.exam,
        examScore : form.score,
        otherExamGiven : form.extraExam,
      }

      await api.post('/api/v1/onboarding/onBoarding',dataToSave).then((res)=>{
        if(res.status == 200 ){
          navigate('/user/dashboard',{replace:true})
        }

      })


    }
  }

  const [submitDisable, setSubmitDisable] = useState(true);

  useEffect(()=>{
       if(form.educationLevel && form.educationField && form.year && form.degree && form.degreeField && form.intake && form.intakeYear && form.budget && form.fundingPlan ){
        setSubmitDisable(false);
       }
  },[form])

  return (
    <div className="flex justify-center items-center min-h-screen  p-6"    >
      <AuroraBackground/>
      {/* <div className="absolute w-full max-w-4xl blur-md rounded-xl border-1 border-grey-400  h-[620px]  z-[1] animated-gradient"></div> */}
      <div className="w-full max-w-4xl  bg-white/50 rounded-xl  p-6 h-[700px] flex flex-col z-[10]">
        <div className="mb-6 px-2 ">
          <StepProgress step={step} />
        </div>

        <h2 className="text-xl font-semibold mb-4">Education Details — Step {step}/4</h2>

        <div className="flex-1 overflow-y-auto pr-1">
          {step === 1 && (
            <div className="space-y-4">
                <UserCard/>

              <Select
                label="Highest Level of Education"
                value={form.educationLevel}
                onChange={(v) => setForm({ ...form, educationLevel: v, educationField: "" })}
              >
                <option value="">Select degree</option>
                {Object.keys(DEGREE_FIELDS).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>

              {  (
                <Select
                  label="Field of Education"
                  value={form.educationField}
                  onChange={(v) => setForm({ ...form, educationField: v })}
                    disable={!(form.educationLevel)}
                >
                <option value="">Select field</option>
                  {form.educationLevel
                   && <>
                  
                  {DEGREE_FIELDS[form.educationLevel].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                  </>
                  }
                </Select>
              )}

              <Select label="Year of Education" value={form.year} onChange={(v) => setForm({ ...form, year: v })}>
                <option value="">Select year</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </Select>

              <Input label="GPA / CGPA" value={form.marks} onChange={(v) => setForm({ ...form, marks: v })} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Select
                label="Degree You Want to Achieve"
                value={form.degree}
                onChange={(v) => setForm({ ...form, degree: v, degreeField: "" })}
              >
                <option value="">Select degree</option>
                {Object.keys(DEGREE_FIELDS).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>

              { (
                <Select
                  label="Course Field"
                  value={form.degreeField}
                  onChange={(v) => setForm({ ...form, degreeField: v })}
                >
                  <option value="">Select field</option>
                  {form.degree && DEGREE_FIELDS[form.degree].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </Select>
              )}

              <Select label="Intake" value={form.intake} onChange={(v) => setForm({ ...form, intake: v })}>
                <option value="">Select intake</option>
                <option>Summer</option>
                <option>Winter</option>
              </Select>

              <Select label="Intake Year" value={form.intakeYear} onChange={(v) => setForm({ ...form, intakeYear: v })}>
                <option value="">Select intake</option>
                <option>2026</option>
                <option>2027</option>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Select label="Budget (USD)" value={form.budget} onChange={(v) => setForm({ ...form, budget: v })}>
                <option value="">Select budget</option>
                {[20000, 25000, 30000, 35000, 40000, 45000, 50000, 100000].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>

              <div>
                <label className="text-sm font-medium">Preferred Countries</label>
                <select
                  onChange={(e) => addCountry(e.target.value)}
                  className="mt-1 w-full border rounded-md p-2"
                >
                  <option value="">Select country</option>
                  {COUNTRIES.filter((c) => !form.countries.includes(c)).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-2 mt-3">
                  {form.countries.map((c) => (
                    <span
                      key={c}
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    >
                      {c}
                      <button onClick={() => removeCountry(c)}>✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Do you have a scholarship?</label>
                <div className="flex gap-6 mt-2">
                  {['yes', 'no'].map((v) => (
                    <label key={v} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={form.scholarship === v}
                        onChange={() => setForm({ ...form, scholarship: v })}
                      />
                      {v === 'yes' ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>

              <Select label="Funding Plan" value={form.fundingPlan} onChange={(v) => setForm({ ...form, fundingPlan: v })}>
                <option value="">Select funding Plan</option>
                {["Self Funding","Loan" ,"Scholarship"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>

                
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Select label="Exam Taken" value={form.exam} onChange={(v) => setForm({ ...form, exam: v })}>
                <option value="">Select exam</option>
                {EXAMS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </Select>

              {<Input label="Exam Score" value={form.score} onChange={(v) => setForm({ ...form, score: v })} />}

              {form.exam && (
                <Select label="Add Another Exam" value={form.extraExam} onChange={(v) => setForm({ ...form, extraExam: v })}>
                  <option value="">Select exam</option>
                  {EXAMS.filter((e) => e !== form.exam).map((e) => (
                    <option key={e}>{e}</option>
                  ))}
                </Select>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 bg-gray-200 rounded-md">
              Previous
            </button>
          )}
          {step < 4 && (
            <button
              onClick={() => setStep(step + 1)}
              className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Next
            </button>
          )}
          {step === 4 && (
            <button className="ml-auto px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-700" disabled={submitDisable} onClick={onSubmit} >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepProgress({ step }) {
  return (
    <>
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className={`flex items-center ${s==4?'':'flex-1'}`}>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-purple-600 text-white' : 'bg-gray-300'
            }`}
          >
            {s}
          </div>
          {s !== 4 && <div className={`flex-1 h-1 ${step > s ? 'bg-purple-600' : 'bg-gray-300'}`} />}
        </div>
      ))}
    </div>
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border rounded-md p-2" />
    </div>
  );
}

function Select({ label, value, onChange, children }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full border rounded-md p-2">
        {children}
      </select>
    </div>
  );
}
