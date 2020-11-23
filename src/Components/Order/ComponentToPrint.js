import React from 'react';

export class ComponentToPrint extends React.PureComponent {
  render() {
    const { data } = this.props;
    if (!data) return <></>;
    return (
      <div>
        {data.map(map => (
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '1000px', height: '1500px' }} src={map.lableDetails.url} alt="" />
            <div style={{ width: '1000px', height: '1500px', margin: '0 auto' }}>
              <table className='table table-bordered' style={{width: '100%', marginTop: '200px', fontSize: '40px', fontWeight: 'bold' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '30px', border: '100px solid #000' }}>Order Number</td>
                    <td style={{ padding: '30px', border: '100px solid #000' }}>{map.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '30px', border: '100px solid #000' }}>Tracking number</td>
                    <td style={{ padding: '30px', border: '100px solid #000', whiteSpace: 'pre-line' }}>{map.lableDetails.partnerTrackingNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ComponentToPrint;