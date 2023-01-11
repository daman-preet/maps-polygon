import React, {useState} from 'react';
import {StatusBar, Keyboard, Image, View} from 'react-native';
import {MainView, PasswordInput, HeadingText} from './SignIn.styled';
import theme from './../../../theme';
import {connect} from 'react-redux';
import {Controller, useForm} from 'react-hook-form';
import {ContainedButton} from './../../../components/Button';
import {TextInput} from './../../../components';
import {fillLoginData} from './../../../storage/UserData';
import {setLoginResponse} from './../../../state/auth/authActions';
import useYupValidationResolver from './../../../validation/resolver';
import {signInSchema} from './../../../validation/authValidation';

interface IProps {
  setLoginResponse?: any;
}

const SignInLayout = ({setLoginResponse}: IProps) => {
  const [showPassword, setShowPassword] = useState(true);
  const [loginEnable, setLoginEnable] = useState(false);
  const [showButtonLoader, setShowButtonLoader] = useState(false);

  type FormData = {
    email: string;
    password: string;
  };

  const resolver = useYupValidationResolver(signInSchema);

  const {
    handleSubmit,
    control,
    getValues,
    setError,
    clearErrors,
    formState: {errors},
  } = useForm<FormData>({
    resolver,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const checkLoginDisabled = () => {
    const value = getValues();
    if (value.email !== '' && value.password !== '') {
      setLoginEnable(true);
    } else {
      setLoginEnable(false);
    }
  };

  const handleLogin = (data: FormData) => {
    Keyboard.dismiss();
    setShowButtonLoader(true);
    let loginObject = {
      email: data.email,
      password: data.password,
    };
    fillLoginData(loginObject);
    setTimeout(() => {
      setShowButtonLoader(false);
      setLoginResponse(loginObject);
    }, 300);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />
      <MainView>
        <View style={{alignItems: 'center', marginBottom: 10}}>
          <Image
            source={require('./../../../assets/images/images.png')}
            style={{height: 100, resizeMode: 'contain'}}
          />
        </View>
        <Controller
          name="email"
          control={control}
          render={({field: {onChange, value}}) => (
            <TextInput
              label="Email Address"
              onChangeText={text => {
                onChange(text.trim());
                checkLoginDisabled();
              }}
              value={value}
              error={!!errors.email}
              errorText={errors.email?.message}
              keyboardType="email-address"
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({field: {onChange, value}}) => (
            <PasswordInput
              testID="PasswordInputID"
              label="Password"
              secureTextEntry={showPassword}
              onIconPress={() => setShowPassword(!showPassword)}
              onChangeText={text => {
                clearErrors('email');
                onChange(text);
                checkLoginDisabled();
              }}
              error={!!errors.password}
              errorText={errors.password?.message}
            />
          )}
        />
        <ContainedButton
          fullWidth
          loading={showButtonLoader}
          onPress={handleSubmit(handleLogin)}
          disabled={!loginEnable}>
          {'Log In'}
        </ContainedButton>
      </MainView>
    </>
  );
};

export default connect(() => ({}), {
  setLoginResponse,
})(SignInLayout);
