import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PoliticaPrivacidade() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 py-32 max-w-4xl bg-white shadow-sm mt-12 mb-12 rounded-2xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">POLÍTICA DE PRIVACIDADE E PROTEÇÃO DE DADOS PESSOAIS</h1>
        <p className="text-slate-500 mb-8 pb-8 border-b border-slate-100">
          Página de Escuta Política — Simone Martini, Pré-Candidata a Deputada Estadual do Paraná (Partido NOVO)<br />
          Última atualização: 20 de Maio de 2026.
        </p>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">1. INTRODUÇÃO</h2>
            <p className="mb-4">
              Esta Política de Privacidade descreve, de forma clara e transparente, como Simone Martini, pré-candidata a Deputada Estadual do Paraná pelo Partido NOVO, coleta, utiliza, armazena, compartilha e protege os dados pessoais das pessoas que voluntariamente preenchem o formulário disponibilizado em simartini.com.br e demais canais oficiais relacionados à pré-candidatura.
            </p>
            <p className="mb-4">
              A presente Política tem por finalidade dar cumprimento à Lei Geral de Proteção de Dados Pessoais — LGPD (Lei nº 13.709/2018), ao Marco Civil da Internet (Lei nº 12.965/2014), à Resolução TSE nº 23.610/2019 (em especial seu art. 33-C, que disciplina o tratamento de dados pessoais por pré-candidaturas, candidaturas e partidos políticos) e à Resolução TSE nº 23.650/2021.
            </p>
            <p>
              Ao preencher o formulário e/ou utilizar a Página de Escuta, você declara ter lido, compreendido e concordado com as disposições desta Política. Caso não concorde, recomenda-se que não preencha o formulário e não envie seus dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">2. DEFINIÇÕES</h2>
            <p className="mb-2">Para os fins desta Política, aplicam-se as seguintes definições, conforme previstas na LGPD:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dado pessoal:</strong> informação relacionada a pessoa natural identificada ou identificável.</li>
              <li><strong>Dado pessoal sensível:</strong> dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico.</li>
              <li><strong>Titular:</strong> a pessoa natural a quem se referem os dados pessoais (você).</li>
              <li><strong>Tratamento:</strong> toda operação realizada com dados pessoais (coleta, uso, armazenamento, compartilhamento, eliminação, etc.).</li>
              <li><strong>Controlador:</strong> pessoa natural ou jurídica a quem compete as decisões referentes ao tratamento de dados pessoais — neste caso, Simone Martini.</li>
              <li><strong>Operador:</strong> pessoa natural ou jurídica que realiza o tratamento em nome do Controlador (ex.: equipe de campanha, fornecedores de tecnologia).</li>
              <li><strong>Encarregado (DPO):</strong> pessoa indicada pelo Controlador para atuar como canal de comunicação com os titulares e a Autoridade Nacional de Proteção de Dados (ANPD).</li>
              <li><strong>ANPD:</strong> Autoridade Nacional de Proteção de Dados, órgão fiscalizador da LGPD no Brasil.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">3. QUEM É O CONTROLADOR DOS SEUS DADOS</h2>
            <p className="mb-2"><strong>Simone Martini</strong> Pré-candidata a Deputada Estadual do Paraná — Partido NOVO</p>
            <ul className="list-none space-y-1 mb-4">
              <li><strong>CPF:</strong> [054.801.029-31]</li>
              <li><strong>Endereço para correspondência:</strong> [Rua Machado de Assis 953 Sarandi PR]</li>
              <li><strong>E-mail oficial:</strong> [sifmartini@hotmail.com]</li>
            </ul>
            <p>A pré-candidata é a responsável pelas decisões sobre o tratamento dos seus dados pessoais coletados por meio da Página de Escuta.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">4. ENCARREGADO(A) PELO TRATAMENTO DE DADOS PESSOAIS (DPO)</h2>
            <p className="mb-2">Em cumprimento ao art. 41 da LGPD, foi designado(a) como Encarregado(a) pelo Tratamento de Dados Pessoais:</p>
            <ul className="list-none space-y-1 mb-4">
              <li><strong>Nome:</strong> [Gustavo Rossano Grandi Bernardelli]</li>
              <li><strong>E-mail para contato:</strong> Gustavo.bernardelli@outlook.com</li>
            </ul>
            <p>Para qualquer dúvida, solicitação ou exercício de direitos previstos na LGPD, entre em contato diretamente com o(a) Encarregado(a) pelos canais acima.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">5. QUAIS DADOS PESSOAIS COLETAMOS</h2>
            <p className="mb-4">Coletamos exclusivamente os dados que você nos fornece de forma voluntária ao preencher o formulário da Página de Escuta. Esses dados podem incluir:</p>
            
            <h3 className="font-semibold mb-2">a) Dados de identificação e contato:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Nome completo</li>
              <li>Cidade e/ou bairro de residência</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone celular e/ou WhatsApp</li>
              <li>Faixa etária ou data de nascimento (quando solicitado)</li>
            </ul>

            <h3 className="font-semibold mb-2">b) Dados sobre a demanda apresentada:</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Descrição livre da demanda, sugestão, crítica ou denúncia que você decide compartilhar</li>
              <li>Categoria temática da demanda (saúde, educação, infraestrutura, segurança, etc.), quando aplicável</li>
              <li>Eventuais arquivos, imagens ou documentos que você anexar voluntariamente</li>
            </ul>

            <h3 className="font-semibold mb-2">c) Dados técnicos e de navegação (coleta automática):</h3>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Endereço de IP</li>
              <li>Tipo de dispositivo, navegador e sistema operacional</li>
              <li>Data e horário de acesso</li>
              <li>Páginas visitadas dentro do nosso domínio</li>
              <li>Cookies e identificadores similares (vide item 14 desta Política)</li>
            </ul>
            
            <p className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <strong>Importante:</strong> Não solicitamos, por meio do formulário público, dados como CPF, RG, número de título de eleitor, dados bancários, biometria ou qualquer outro dado financeiro ou de identificação civil que não seja estritamente necessário à finalidade da escuta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">6. DADOS PESSOAIS SENSÍVEIS — OPINIÃO POLÍTICA</h2>
            <p className="mb-4">
              Você reconhece que, ao apresentar uma demanda, crítica, sugestão ou denúncia por meio da Página de Escuta, pode acabar expressando opiniões políticas, filiação a movimentos sociais ou outras informações que a LGPD classifica como dados pessoais sensíveis (art. 5º, II, da LGPD).
            </p>
            <p className="mb-4">
              O tratamento desses dados sensíveis ocorrerá com base no seu consentimento livre, informado, específico e destacado, manifestado no momento do envio do formulário (art. 11, I, da LGPD), exclusivamente para as finalidades descritas no item 7 desta Política.
            </p>
            <p>
              Você pode revogar o consentimento a qualquer momento, conforme previsto no item 11.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">7. PARA QUE UTILIZAMOS SEUS DADOS (FINALIDADES)</h2>
            <p className="mb-4">Seus dados pessoais são utilizados exclusivamente para as seguintes finalidades, todas vinculadas ao processo de escuta política e à construção do projeto político da pré-candidatura:</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Receber, registrar e analisar as demandas, sugestões, críticas e denúncias enviadas pelos cidadãos.</li>
              <li>Organizar diagnósticos territoriais das pautas levantadas em cada município, bairro e região.</li>
              <li>Entrar em contato com você, por e-mail, telefone, WhatsApp ou outros canais informados, para esclarecer dúvidas, aprofundar o entendimento sobre a demanda enviada ou dar retorno sobre encaminhamentos.</li>
              <li>Embasar propostas, agendas, debates públicos, conteúdos informativos e materiais de comunicação da pré-candidatura, sempre de forma anônima ou agregada quando se tratar de divulgação pública.</li>
              <li>Manter o registro das operações de tratamento de dados pessoais exigido pelo art. 33-C da Resolução TSE nº 23.610/2019.</li>
              <li>Cumprir obrigações legais e regulatórias aplicáveis à pré-campanha e à eventual campanha eleitoral, inclusive obrigações junto à Justiça Eleitoral e à ANPD.</li>
              <li>Garantir a segurança da informação e prevenir fraudes, abusos ou uso indevido da Página de Escuta.</li>
            </ol>
            
            <p className="font-semibold mb-2">Não utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vendê-los, cedê-los ou comercializá-los a terceiros.</li>
              <li>Realizar propaganda eleitoral antecipada que peça voto de forma direta antes do período legalmente permitido (a partir de 16 de agosto de 2026), nos termos da legislação eleitoral em vigor.</li>
              <li>Submetê-los a decisões automatizadas que produzam efeitos jurídicos relevantes sobre você, sem possibilidade de revisão humana.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">8. BASE LEGAL DO TRATAMENTO</h2>
            <p className="mb-2">O tratamento dos seus dados pessoais está fundamentado nas seguintes bases legais previstas na LGPD:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consentimento do titular</strong> (art. 7º, I, e art. 11, I, da LGPD), manifestado por você no momento do preenchimento do formulário.</li>
              <li><strong>Cumprimento de obrigação legal ou regulatória pelo controlador</strong> (art. 7º, II), em especial as obrigações decorrentes da legislação eleitoral.</li>
              <li><strong>Exercício regular de direitos em processo judicial, administrativo ou arbitral</strong> (art. 7º, VI), quando aplicável.</li>
              <li><strong>Legítimo interesse do controlador</strong> (art. 7º, IX), para fins de organização interna das demandas e retorno ao titular, sempre respeitados os direitos fundamentais e a legítima expectativa do titular.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">9. COM QUEM PODEMOS COMPARTILHAR SEUS DADOS</h2>
            <p className="mb-4">Seus dados pessoais não são vendidos, alugados ou comercializados em qualquer hipótese. O compartilhamento ocorre exclusivamente com:</p>
            <ul className="list-none space-y-4">
              <li><strong>a) Equipe interna da pré-candidatura:</strong> coordenação, equipe de marketing, assessoria política e equipe de mobilização, todos submetidos a deveres formais de confidencialidade.</li>
              <li><strong>b) Prestadores de serviço (Operadores):</strong> fornecedores de tecnologia que apoiam o funcionamento da Página de Escuta, hospedagem do site, armazenamento em nuvem, plataforma de e-mail e CRM, todos submetidos a contratos de tratamento de dados compatíveis com a LGPD.</li>
              <li><strong>c) Partido NOVO:</strong> quando estritamente necessário ao alinhamento da pauta política e às obrigações partidárias, observadas as garantias desta Política.</li>
              <li><strong>d) Autoridades públicas e órgãos reguladores:</strong> Justiça Eleitoral, ANPD, Ministério Público e demais autoridades, quando houver requisição legal, ordem judicial ou exigência regulatória.</li>
              <li><strong>e) Assessoria jurídica:</strong> advogado(a) eleitoral e demais profissionais contratados para defesa de direitos e cumprimento de obrigações legais.</li>
            </ul>
            <p className="mt-4">Em qualquer hipótese, o compartilhamento será limitado ao mínimo necessário e os terceiros estarão obrigados ao mesmo padrão de proteção previsto nesta Política.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">10. TRANSFERÊNCIA INTERNACIONAL DE DADOS</h2>
            <p>
              Eventualmente, alguns dos serviços de tecnologia utilizados (hospedagem, e-mail, ferramentas de formulário) podem armazenar dados em servidores localizados fora do Brasil. Nessas hipóteses, asseguraremos que a transferência ocorra apenas para países que ofereçam grau de proteção adequado ou mediante a adoção de cláusulas contratuais específicas, conforme exigência dos arts. 33 a 36 da LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">11. SEUS DIREITOS COMO TITULAR DOS DADOS</h2>
            <p className="mb-4">A LGPD garante a você, titular dos dados, os seguintes direitos, exercíveis a qualquer momento e gratuitamente (art. 18 da LGPD):</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Confirmação da existência de tratamento dos seus dados.</li>
              <li>Acesso aos dados que tratamos sobre você.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço ou produto, mediante requisição expressa, observados os regulamentos da ANPD.</li>
              <li>Eliminação dos dados pessoais tratados com base no seu consentimento, ressalvadas as hipóteses de guarda previstas no art. 16 da LGPD.</li>
              <li>Informação sobre as entidades públicas e privadas com as quais compartilhamos seus dados.</li>
              <li>Informação sobre a possibilidade de não fornecer consentimento e as consequências dessa recusa.</li>
              <li>Revogação do consentimento a qualquer momento, sem prejuízo da licitude do tratamento realizado anteriormente à revogação.</li>
              <li>Petição perante a ANPD em caso de descumprimento desta Política ou da LGPD.</li>
              <li>Oposição ao tratamento realizado com fundamento em uma das hipóteses de dispensa de consentimento, em caso de descumprimento da LGPD.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">12. COMO EXERCER SEUS DIREITOS</h2>
            <p className="mb-4">Para exercer qualquer um dos direitos acima, envie um e-mail para <strong>sifmartini@hotmail.com</strong> com o assunto "Solicitação LGPD" e informe:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Seu nome completo.</li>
              <li>O direito que deseja exercer.</li>
              <li>A descrição clara da sua solicitação.</li>
            </ul>
            <p className="mb-4">
              Responderemos sua solicitação em até 15 (quinze) dias úteis, conforme previsto na LGPD. Em casos excepcionais que demandem prazo adicional, comunicaremos previamente a justificativa e o novo prazo estimado.
            </p>
            <p>
              Para verificarmos sua identidade e garantir a segurança da operação, podemos solicitar informações adicionais antes de processar o pedido.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">13. SEGURANÇA DA INFORMAÇÃO</h2>
            <p className="mb-4">Adotamos medidas técnicas e administrativas razoáveis para proteger seus dados pessoais contra acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão indevida. Entre essas medidas estão:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Controle de acesso restrito aos membros autorizados da equipe.</li>
              <li>Acordos de confidencialidade com colaboradores e fornecedores.</li>
              <li>Armazenamento em ambientes de nuvem com criptografia e backups regulares.</li>
              <li>Protocolos de resposta a incidentes de segurança.</li>
            </ul>
            <p>
              Apesar de todos os esforços, nenhum sistema de informação é absolutamente seguro. Caso ocorra qualquer incidente de segurança que possa acarretar risco ou dano relevante a você, comunicaremos o fato à ANPD e a você, conforme prazos e procedimentos previstos na LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">14. COOKIES</h2>
            <p className="mb-4">A Página de Escuta pode utilizar cookies e tecnologias similares para:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>Garantir o funcionamento adequado da página.</li>
              <li>Lembrar suas preferências.</li>
              <li>Medir audiência, comportamento de navegação e eficácia de comunicações.</li>
            </ul>
            <p>
              Você pode, a qualquer momento, configurar seu navegador para recusar cookies ou ser avisado quando forem enviados. Ressaltamos, contudo, que a desativação de determinados cookies pode comprometer o funcionamento da página.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">15. PRAZO DE ARMAZENAMENTO DOS DADOS</h2>
            <p className="mb-4">Seus dados pessoais serão armazenados pelo tempo necessário ao cumprimento das finalidades descritas nesta Política, observados os seguintes parâmetros:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Durante a pré-campanha e a campanha eleitoral de 2026, para análise das demandas e organização das pautas.</li>
              <li>Até 18 de dezembro de 2026, no mínimo, em cumprimento ao dever de manutenção do registro das operações de tratamento de dados pessoais previsto no art. 33-C da Resolução TSE nº 23.610/2019.</li>
              <li>Por prazo superior, em caso de ajuizamento de ação que apure irregularidade ou ilicitude no tratamento de dados, ou quando exigido por lei, decisão judicial ou requisição de autoridade competente.</li>
            </ul>
            <p>
              Após o cumprimento das finalidades e o decurso dos prazos legais, seus dados serão eliminados de forma segura ou anonimizados de modo irreversível.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">16. ADOLESCENTES E CRIANÇAS</h2>
            <p className="mb-4">
              A Página de Escuta é destinada a pessoas com 16 (dezesseis) anos ou mais, idade mínima do alistamento eleitoral facultativo no Brasil.
            </p>
            <p className="mb-4">
              O tratamento de dados de adolescentes entre 16 e 18 anos será realizado com observância do seu melhor interesse, conforme art. 14 da LGPD, e poderá ser solicitada a anuência de um dos pais ou responsável legal sempre que cabível.
            </p>
            <p>
              Não coletamos intencionalmente dados de crianças menores de 12 anos. Caso identifiquemos qualquer coleta indevida, eliminaremos os dados imediatamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">17. ALTERAÇÕES DESTA POLÍTICA</h2>
            <p className="mb-4">
              Esta Política de Privacidade poderá ser atualizada periodicamente para refletir mudanças legais, regulatórias, operacionais ou tecnológicas — em especial quando da entrada no período oficial de campanha eleitoral, a partir de 16 de agosto de 2026.
            </p>
            <p className="mb-4">
              Recomendamos que você consulte esta Política regularmente. A versão mais recente estará sempre disponível na Página de Escuta, com a data de atualização indicada no topo do documento.
            </p>
            <p>
              Alterações relevantes serão comunicadas pelos canais de contato informados, sempre que possível.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">18. LEGISLAÇÃO APLICÁVEL E FORO</h2>
            <p className="mb-4">
              Esta Política é regida pelas leis da República Federativa do Brasil, em especial pela Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), pelo Marco Civil da Internet (Lei nº 12.965/2014) e pela legislação eleitoral aplicável.
            </p>
            <p>
              Fica eleito o Foro da Comarca de Sarandi/PR para dirimir quaisquer controvérsias decorrentes desta Política, com renúncia a qualquer outro, por mais privilegiado que seja, sem prejuízo da competência exclusiva da Justiça Eleitoral para matérias de sua alçada.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">19. ACEITE</h2>
            <p className="mb-4">Ao marcar a caixa de aceite no formulário e clicar em "Enviar", você declara que:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Leu e compreendeu integralmente esta Política de Privacidade.</li>
              <li>Concorda com o tratamento dos seus dados pessoais para as finalidades aqui descritas.</li>
              <li>Consente expressamente, de forma livre, informada e específica, com o tratamento de eventuais dados pessoais sensíveis (como opiniões políticas) compartilhados voluntariamente.</li>
              <li>Está ciente de que pode revogar o consentimento e exercer seus direitos a qualquer momento, pelos canais informados no item 12.</li>
            </ol>
          </section>
          
          <div className="pt-8 mt-8 border-t border-slate-200">
            <p><strong>Data de vigência:</strong> 14 de Agosto de 2026.</p>
            <p><strong>Simone Martini</strong> Pré-candidata a Deputada Estadual do Paraná — Partido NOVO</p>
            <br/>
            <p>Em caso de dúvidas sobre esta Política, entre em contato com nosso Encarregado pelo Tratamento de Dados Pessoais pelo e-mail <strong>sifmartini@hotmail.com</strong>.</p>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
