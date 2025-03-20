namespace :populate do
    desc "Popularea tabelei countries"
    task countries: :environment do
      
        # Șterge toate înregistrările din tabela countries
        Country.delete_all

      
    end
  end
  