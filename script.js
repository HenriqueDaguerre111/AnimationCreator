document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-animation');
  const copyCodeButton = document.getElementById('copy-code');
  const animatedElement = document.getElementById('animated-element');
  const cssCodeElement = document.getElementById('css-code');
  const colorInputs = document.querySelectorAll('.color-button'); // Inputs de cor

  if (!generateButton || !copyCodeButton || !animatedElement || !cssCodeElement) {
    console.error('Alguns elementos essenciais não foram encontrados no DOM.');
    return;
  }

  // Atualizar os botões de cor dinamicamente
  colorInputs.forEach(input => {
    input.addEventListener('input', (event) => {
      event.target.style.backgroundColor = event.target.value;
    });

    // Configurar a cor inicial no carregamento da página
    input.style.backgroundColor = input.value;
  });

  // Verificar se os dados dos inputs são válidos
  const validateInputs = () => {
    const inputsToValidate = [
      { id: 'duration', validator: value => value >= 0, message: 'A duração deve ser um valor positivo.' },
      { id: 'delay', validator: value => value >= 0, message: 'O atraso deve ser maior ou igual a 0.' },
      { id: 'size', validator: value => value >= 10, message: 'O tamanho deve ser pelo menos 10px.' },
      { id: 'border', validator: value => value >= 0, message: 'A espessura da borda não pode ser negativa.' },
      { id: 'opacity', validator: value => value >= 0 && value <= 1, message: 'A opacidade deve estar entre 0 e 1.' },
    ];

    let allValid = true;

    inputsToValidate.forEach(({ id, validator, message }) => {
      const input = document.getElementById(id);
      const errorMessage = document.querySelector(`#${id}-error`);
      const value = parseFloat(input.value);

      if (!validator(value)) {
        // Mostrar mensagem de erro e aplicar estilos
        if (!errorMessage) {
          const error = document.createElement('div');
          error.id = `${id}-error`;
          error.style.color = 'red';
          error.style.fontSize = '0.9rem';
          error.style.marginTop = '5px';
          error.textContent = message;
          input.parentNode.appendChild(error);
        }

        input.style.borderColor = 'red';
        allValid = false;
      } else {
        // Remover mensagem de erro e estilos de alerta
        if (errorMessage) {
          errorMessage.remove();
        }
        input.style.borderColor = '';
      }
    });

    // Ativar ou desativar o botão de executar animação
    generateButton.disabled = !allValid;
    generateButton.style.cursor = allValid ? 'pointer' : 'not-allowed';
  };

  // Adicionar eventos de validação nos inputs
  const inputs = ['duration', 'delay', 'size', 'border', 'opacity'].map(id => document.getElementById(id));
  inputs.forEach(input => {
    input.addEventListener('input', validateInputs);
    input.addEventListener('blur', validateInputs);
  });

  // Validação inicial ao carregar a página
  validateInputs();

  generateButton.addEventListener('click', () => {
    const animationTypeElement = document.getElementById('animation-type');
    const durationElement = document.getElementById('duration');
    const delayElement = document.getElementById('delay');
    const iterationElement = document.getElementById('iteration');
    const timingFunctionElement = document.getElementById('timing-function');
    const transformationsElement = document.getElementById('transformations');
    const customKeyframesElement = document.getElementById('custom-keyframes');

    const backgroundColorElement = document.getElementById('background-color');
    const borderColorElement = document.getElementById('border-color');
    const sizeElement = document.getElementById('size');
    const borderElement = document.getElementById('border');
    const opacityElement = document.getElementById('opacity');
    const gradientElement = document.getElementById('background-gradient');

    const animationType = animationTypeElement.value;
    const duration = parseFloat(durationElement.value) || 1;
    const delay = parseFloat(delayElement.value) || 0;
    const iteration = iterationElement.value || 'infinite';
    const timingFunction = timingFunctionElement.value;
    const transform = transformationsElement.value || 'none';
    const keyframesCSSInput = customKeyframesElement.value.trim();

    const color = backgroundColorElement.value;
    const borderColor = borderColorElement.value;
    const size = parseInt(sizeElement.value) || 100;
    const border = parseInt(borderElement.value) || 0;
    const opacity = parseFloat(opacityElement.value) || 1;
    const gradient = gradientElement.value;

    let keyframesCSS = '';
    let animationName = '';

    if (keyframesCSSInput) {
      keyframesCSS = keyframesCSSInput;
      const match = keyframesCSS.match(/@keyframes\s+([a-zA-Z0-9_-]+)/);
      animationName = match ? match[1] : 'customAnimation';
    } else {
      if (animationType === 'move') {
        animationName = 'moveAnimation';
        keyframesCSS = `
          @keyframes moveAnimation {
            0% { transform: translateX(0); }
            50% { transform: translateX(100px); }
            100% { transform: translateX(0); }
          }
        `;
      } else if (animationType === 'rotate') {
        animationName = 'rotateAnimation';
        keyframesCSS = `
          @keyframes rotateAnimation {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(180deg); }
            100% { transform: rotate(360deg); }
          }
        `;
      } else if (animationType === 'fade') {
        animationName = 'fadeAnimation';
        keyframesCSS = `
          @keyframes fadeAnimation {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `;
      } else if (animationType === 'scale') {
        animationName = 'scaleAnimation';
        keyframesCSS = `
          @keyframes scaleAnimation {
            0% { transform: scale(1); }
            50% { transform: scale(1.5); }
            100% { transform: scale(1); }
          }
        `;
      } else if (animationType === 'bounce') {
        animationName = 'bounceAnimation';
        keyframesCSS = `
          @keyframes bounceAnimation {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-50px); }
          }
        `;
      }
    }

    animatedElement.style.animation = 'none';
    void animatedElement.offsetWidth;

    animatedElement.style.width = `${size}px`;
    animatedElement.style.height = `${size}px`;
    animatedElement.style.borderRadius = '0';
    animatedElement.style.border = `${border}px solid ${borderColor}`;
    animatedElement.style.opacity = opacity;

    if (gradient) {
      animatedElement.style.backgroundImage = gradient;
      animatedElement.style.backgroundColor = 'transparent';
    } else {
      animatedElement.style.backgroundImage = 'none';
      animatedElement.style.backgroundColor = color;
    }

    animatedElement.style.animation = `${animationName} ${duration}s ${timingFunction} ${delay}s ${iteration}`;
    animatedElement.style.transform = transform;

    const completeCSS = `
${keyframesCSS}

#animated-element {
  width: ${size}px;
  height: ${size}px;
  border: ${border}px solid ${borderColor};
  background-color: ${gradient ? 'transparent' : color};
  background-image: ${gradient || 'none'};
  opacity: ${opacity};
  transform: ${transform};
  animation: ${animationName} ${duration}s ${timingFunction} ${delay}s ${iteration};
}
    `;

    cssCodeElement.textContent = completeCSS;

    const existingStyleTag = document.getElementById('dynamic-style');
    if (existingStyleTag) existingStyleTag.remove();

    const styleTag = document.createElement('style');
    styleTag.id = 'dynamic-style';
    styleTag.textContent = keyframesCSS;
    document.head.appendChild(styleTag);
  });

  copyCodeButton.addEventListener('click', () => {
    navigator.clipboard.writeText(cssCodeElement.textContent)
      .then(() => alert('Código copiado com sucesso!'))
      .catch(() => alert('Erro ao copiar o código.'));
  });
});
