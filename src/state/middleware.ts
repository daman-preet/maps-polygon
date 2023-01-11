import { fetchData, IFetchOptions } from 'src/services/Fetch';

type CustomClientProps = {
  dispatch: any;
  types?: any;
  onSuccess: any;
  onError: any;
};

type ClientProp = CustomClientProps & IFetchOptions;

// Client API Call
export const clientCall = (props: ClientProp) => {
  const { dispatch, types, onSuccess, onError } = props;
  const { ACTION, SUCCESS, ERROR } = types;
  console.log('Types', ACTION, SUCCESS, ERROR);
  dispatch({
    type: ACTION,
  });

  return fetchData(props, dispatch)
    .then(json => {
      console.log('success:', JSON.stringify(json));
      const success = dispatch({
        type: SUCCESS,
        payload: json.data,
      });
      onSuccess && onSuccess(success);
    })
    .catch(err => {
      console.log('error:', JSON.stringify(err));
      const error = dispatch({
        type: ERROR,
        payload: err,
      });
      onError && onError(error);
    });
};
