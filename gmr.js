
// create by scratch3-extension generator
const ArgumentType = Scratch.ArgumentType;
const BlockType = Scratch.BlockType;
const formatMessage = Scratch.formatMessage;
const log = Scratch.log;

const menuIconURI = null;
const blockIconURI = null;

class bmr{
  constructor (runtime){
    this.runtime = runtime;
    // communication related
    this.comm = runtime.ioDevices.comm;
    this.session = null;
    this.runtime.registerPeripheralExtension('bmr', this);
    // session callbacks
    this.reporter = null;
    this.onmessage = this.onmessage.bind(this);
    this.onclose = this.onclose.bind(this);
    this.write = this.write.bind(this);
    // string op
    this.decoder = new TextDecoder();
    this.lineBuffer = '';
  }

  onclose (){
    this.session = null;
  }

  write (data, parser = null){
    if (this.session){
      return new Promise(resolve => {
        if (parser){
          this.reporter = {
            parser,
            resolve
          }
        }
        this.session.write(data);
      })
    }
  }

  onmessage (data){
    const dataStr = this.decoder.decode(data);
    this.lineBuffer += dataStr;
    if (this.lineBuffer.indexOf('\n') !== -1){
      const lines = this.lineBuffer.split('\n');
      this.lineBuffer = lines.pop();
      for (const l of lines){
        if (this.reporter){
          const {parser, resolve} = this.reporter;
          resolve(parser(l));
        };
      }
    }
  }

  scan (){
    this.comm.getDeviceList().then(result => {
        this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
    });
  }

  getInfo (){
    return {
      id: 'bmr',
      name: 'boolean message reciever',
      color1: '#ffe500',
      color2: '#ebff00',
      menuIconURI: menuIconURI,
      blockIconURI: blockIconURI,
      blocks: [
        {
          opcode: 'bmr',
          blockType: BlockType.BOOLEAN,
          arguments: {
            when I receive ( ): {
              type: ArgumentType.BOOLEAN
            }
          },
          text: '[when I receive ( )]'
        },
        {
          opcode: 'bmr2',
          blockType: BlockType.REPORTER,
          arguments: {
            when I receive ( ): {
              type: ArgumentType.STRING
            }
          },
          text: '[when I receive ( )]'
        },
        {
          opcode: 'bmr3',
          blockType: BlockType.COMMAND,
          arguments: {
            when I receive ( ): {
              type: ArgumentType.STRING
            }
          },
          text: '[when I receive ( )]'
        }
      ]
    }
  }

bmr (args, util){
  const when I receive ( ) = args.when I receive ( );

  return this.write(`M0 \n`);
}

bmr2 (args, util){
  const when I receive ( ) = args.when I receive ( );

  return this.write(`M0 \n`);
}

bmr3 (args, util){
  const when I receive ( ) = args.when I receive ( );

  return this.write(`M0 \n`);
}

}

module.exports = bmr;
