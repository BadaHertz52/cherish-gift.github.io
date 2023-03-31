import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { SignUpContext } from '../../pages/SignUp';
import CheckBox from '../CheckBox';
import { AgreementStateType, SignUpStateType, TermsCheckBoxNameType } from './signUpTypes';
import StepInner from './StepInner';
import ConfirmModal from '../modals/ConfirmModal';
import { ConfirmModalBtnType, ConfirmModalType } from '../modals/modalTypes';

type SignUpTermProps = {
  id: TermsCheckBoxNameType;
  label: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickBtn: () => void;
};
const SignUpTerm = ({ id, label, onChange, onClickBtn }: SignUpTermProps) => {
  return (
    <div className="term">
      <CheckBox id={id} name={id} label={label} onChange={onChange} />
      <button className="btn-open-modal" onClick={onClickBtn} type="button">
        내용보기
      </button>
    </div>
  );
};
const SignUpTerms = () => {
  const { signUpState, setSignUpState } = useContext(SignUpContext);

  const initialAgreement: AgreementStateType = {
    termsAndCondition: false,
    personalInformation: false,
    marketing: false,
  };
  const [agreement, setAgreement] = useState<AgreementStateType>(initialAgreement);

  // NextBtn 비활성화 여부
  const [disableBtn, setDisableBtn] = useState<boolean>(true);
  const makeYestBtnValue = (name: TermsCheckBoxNameType): ConfirmModalBtnType => {
    return {
      //btn 의 text node
      text: '동의하기',
      //btn 클릭 시 이동해야 할 페이지의 경로
      path: null,
      //btn 클릭 시 이동/창 닫기 외의 필요한 기능
      otherFn: () => onClickYesBtn(name),
    };
  };
  const makeNoBtnValue = (name: TermsCheckBoxNameType): ConfirmModalBtnType => {
    return {
      //btn 의 text node
      text: '닫기',
      //btn 클릭 시 이동해야 할 페이지의 경로
      path: null,
      //btn 클릭 시 이동/창 닫기 외의 필요한 기능
      otherFn: null,
    };
  };
  const modalForTermsAndCondition: ConfirmModalType = {
    title: '이용약관(필수)',
    contents: 'contents',
    yesBtn: makeYestBtnValue('termsAndCondition'),
    noBtn: makeNoBtnValue('termsAndCondition'),
  };
  const modalForPersonalInformation: ConfirmModalType = {
    title: '개인정보 수집 및 이용(필수)',
    contents: 'contents',
    yesBtn: makeYestBtnValue('personalInformation'),
    noBtn: makeNoBtnValue('personalInformation'),
  };
  const modalForMarketing: ConfirmModalType = {
    title: '마케팅 정보 활용 동의(선택)',
    contents: 'contents',
    yesBtn: makeYestBtnValue('marketing'),
    noBtn: makeNoBtnValue('marketing'),
  };
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalState, setModalState] = useState<ConfirmModalType>(modalForTermsAndCondition);
  const onClickNextBtn = () => {
    setSignUpState((prevState: SignUpStateType) => {
      const newState: SignUpStateType = {
        ...prevState,
        progress: 'nameAndNickName',
        agreeToTerms: agreement,
      };
      return newState;
    });
  };
  const handleWholeAgree = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement | null;
    if (target !== null) {
      const checked = target.checked;
      setAgreement({
        termsAndCondition: checked,
        personalInformation: checked,
        marketing: checked,
      });
      const listOfInput = document.querySelectorAll('input');
      listOfInput.forEach(el => (el.checked = checked));
    }
  };
  function changeAgreement(name: TermsCheckBoxNameType, checked: boolean) {
    switch (name) {
      case 'termsAndCondition':
        setAgreement((prev: AgreementStateType) => {
          const newState: AgreementStateType = {
            ...prev,
            termsAndCondition: checked,
          };
          return newState;
        });
        break;
      case 'personalInformation':
        setAgreement((prev: AgreementStateType) => {
          const newState: AgreementStateType = {
            ...prev,
            personalInformation: checked,
          };
          return newState;
        });
        break;
      case 'marketing':
        setAgreement((prev: AgreementStateType) => {
          const newState: AgreementStateType = {
            ...prev,
            marketing: checked,
          };
          return newState;
        });
        break;

      default:
        break;
    }
  }
  function onClickYesBtn(name: TermsCheckBoxNameType) {
    const targetInputEl = document.querySelector(`#${name}`) as HTMLInputElement | null;
    if (targetInputEl !== null) {
      targetInputEl.checked = true;
    }
    changeAgreement(name, true);
  }
  const handleCheckBoxOfTerm = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement | null;
    if (target !== null) {
      const name = target.name as TermsCheckBoxNameType;
      const checked = target.checked;
      if (!checked) {
        const wholeAgreeInput = document.querySelector(
          `#checkBox-whole-agree`,
        ) as HTMLInputElement | null;
        if (wholeAgreeInput !== null && wholeAgreeInput.checked) {
          wholeAgreeInput.checked = false;
        }
      }
      changeAgreement(name, checked);
    }
  };
  const onClickToShowTerm = (name: TermsCheckBoxNameType) => {
    setOpenModal(true);
    switch (name) {
      case 'termsAndCondition':
        setModalState(modalForTermsAndCondition);
        break;
      case 'personalInformation':
        setModalState(modalForPersonalInformation);
        break;
      case 'marketing':
        setModalState(modalForMarketing);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    if (agreement.termsAndCondition && agreement.personalInformation) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [agreement]);
  return (
    <div id="sign-up__terms" className="step">
      <StepInner disableBtn={disableBtn} onClickNextBtn={onClickNextBtn}>
        <div className="top">
          <div className="header">
            <p>아래 약관에 동의하시면</p>
            <p>정성스러운 선물을 추천해드려요</p>
          </div>
          <CheckBox
            id="checkBox-whole-agree"
            name="checkBox-whole-agree"
            label="전체 동의"
            onChange={handleWholeAgree}
          />
        </div>
        <section className="terms-group">
          <SignUpTerm
            id="termsAndCondition"
            label="이용약관(필수)"
            onChange={handleCheckBoxOfTerm}
            onClickBtn={() => onClickToShowTerm('termsAndCondition')}
          />
          <SignUpTerm
            id="personalInformation"
            label="개인정보 수집 및 이용(필수)"
            onChange={handleCheckBoxOfTerm}
            onClickBtn={() => onClickToShowTerm('personalInformation')}
          />
          <SignUpTerm
            id="marketing"
            label="마케팅 정보 활용 동의(선택)"
            onChange={handleCheckBoxOfTerm}
            onClickBtn={() => onClickToShowTerm('marketing')}
          />
        </section>
      </StepInner>
      {openModal && <ConfirmModal modalState={modalState} closeModal={() => setOpenModal(false)} />}
    </div>
  );
};

export default SignUpTerms;
