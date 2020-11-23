import React from 'react';

export class ComponentToPrint extends React.PureComponent {
  render() {
    const { data } = this.props;
    if (!data) return <></>;
    return (
      <div>
        {data.map(map => (
          <div>
            <img src={map} alt="" />
          </div>
        ))}
      </div>
    );
  }
}

export default ComponentToPrint;